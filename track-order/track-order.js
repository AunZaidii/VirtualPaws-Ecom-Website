import { apiClient } from "../utils/apiClient.js";
import { requireAuth } from "../utils/authGuard.js";

// Check authentication before tracking order
await requireAuth();

// Auto-fill form if order_number and email are in URL
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('order_number');
    const email = urlParams.get('email');

    if (orderNumber) {
        document.getElementById('orderNumber').value = orderNumber;
    }

    if (email) {
        document.getElementById('email').value = decodeURIComponent(email);
    }

    // Auto-submit if both parameters are present
    if (orderNumber && email) {
        // Small delay to ensure form is ready
        setTimeout(() => {
            const form = document.querySelector('#trackOrderForm form');
            if (form) {
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        }, 500);
    }
});

function formatDate(dateStr) {
    if (!dateStr) return "Not Available";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function formatDateTime(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleString();
}

export async function trackOrder(event) {
    event.preventDefault();

    const orderNumber = document.getElementById("orderNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const errorDiv = document.getElementById("formError");

    if (!orderNumber || !email) {
        errorDiv.textContent = "Please enter both order number and email address";
        errorDiv.style.display = "block";
        return;
    }

    errorDiv.style.display = "none";

    try {
        // This assumes apiClient.get("trackOrder", params) calls Supabase
        const order = await apiClient.get("trackOrder", {
            order_number: orderNumber,
            email
        });

        if (!order) {
            errorDiv.textContent = "Order not found";
            errorDiv.style.display = "block";
            return;
        }

        // --------- HEADER INFO ----------
        document.getElementById("orderIdDisplay").textContent = `Order #${order.order_number}`;
        document.getElementById("trackingNumberDisplay").textContent = `Tracking Number: ${order.order_number}`;
        document.getElementById("orderStatusText").textContent = order.tracking_status || "Pending";
        document.getElementById("currentLocation").textContent = order.current_location || "Unknown";
        document.getElementById("estimatedDelivery").textContent = formatDate(order.estimated_delivery);

        // --------- ORDER ITEMS ----------
        const itemsContainer = document.getElementById("orderItems");
        itemsContainer.innerHTML = "";

        const items = order.items || [];
        items.forEach(item => {
            itemsContainer.innerHTML += `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div>
                        <p>${item.title}</p>
                        <p>${item.quantity} × $${item.price}</p>
                    </div>
                </div>
            `;
        });

        // --------- RIDER INFO ----------
        const riderInfoCard = document.getElementById("riderInfoCard");
        const currentStatus = order.tracking_status;
        
        // Show rider info if order is confirmed or out for delivery and rider is assigned
        if ((currentStatus === "Order Confirmed" || currentStatus === "Out for Delivery") && order.rider_name) {
            document.getElementById("riderName").textContent = order.rider_name;
            document.getElementById("riderPhone").textContent = order.rider_phone || "N/A";
            
            const riderImageEl = document.getElementById("riderImage");
            if (order.rider_image) {
                riderImageEl.src = order.rider_image;
                riderImageEl.style.display = "block";
            } else {
                riderImageEl.style.display = "none";
            }
            
            riderInfoCard.style.display = "block";
        } else {
            riderInfoCard.style.display = "none";
        }

        // --------- TIMELINE ----------
        const timelineContainer = document.getElementById("timeline");
        timelineContainer.innerHTML = "";

        const history = order.tracking_history || [];
        history.forEach((step, index) => {
            const isLast = index === history.length - 1;
            const completed = true; // all existing steps in history are completed
            const iconClass = completed ? "completed" : "pending";

            const wrapper = document.createElement("div");
            wrapper.className = "timeline-item";

            wrapper.innerHTML = `
                <div class="timeline-marker">
                    <div class="timeline-icon ${iconClass}">
                        ${getTimelineIcon(step.title)}
                    </div>
                    ${!isLast ? `<div class="timeline-line ${iconClass}"></div>` : ""}
                </div>
                <div class="timeline-content ${iconClass}">
                    <div>${step.title}</div>
                    <div class="timeline-date">
                        ${formatDateTime(step.timestamp)}
                    </div>
                    <div class="timeline-location">
                        ${step.location || ""}
                    </div>
                </div>
            `;

            timelineContainer.appendChild(wrapper);
        });

        // --------- SHOW RESULT ----------
        document.getElementById("trackOrderForm").style.display = "block";
        document.getElementById("orderStatus").style.display = "block";
        document.getElementById("trackOrderForm").style.display = "none";

        window.scrollTo(0, 0);
    } catch (err) {
        console.error(err);
        const errorMsg = err?.message || "Error fetching order. Please try again.";
        errorDiv.textContent = errorMsg;
        errorDiv.style.display = "block";
    }
}

function getTimelineIcon(status) {
    const icons = {
        "Order Placed":
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        "Order Confirmed":
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        "Out for Delivery":
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
        "Delivered":
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    };

    return icons[status] || icons["Order Placed"];
}

export function resetTrackingForm() {
    document.getElementById("trackOrderForm").style.display = "block";
    document.getElementById("orderStatus").style.display = "none";
    document.getElementById("orderNumber").value = "";
    document.getElementById("email").value = "";
    document.getElementById("formError").style.display = "none";
    window.scrollTo(0, 0);
}

// Expose functions to global scope for inline HTML onsubmit / onclick
window.trackOrder = trackOrder;
window.resetTrackingForm = resetTrackingForm;
