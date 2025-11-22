import { apiClient } from "../utils/apiClient.js";

/* -------------------------------------
   GLOBAL TOAST
------------------------------------- */
function showToast(message, type = "success") {
    let toast = document.getElementById("globalToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "globalToast";
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.right = "20px";
        toast.style.padding = "12px 20px";
        toast.style.borderRadius = "8px";
        toast.style.color = "#fff";
        toast.style.fontSize = "14px";
        toast.style.zIndex = "999999";
        toast.style.transition = "opacity 0.4s";
        document.body.appendChild(toast);
    }

    toast.style.backgroundColor = type === "error" ? "#ff4d4d" : "#87da48";
    toast.textContent = message;
    toast.style.opacity = "1";

    setTimeout(() => (toast.style.opacity = "0"), 2600);
}

/* -------------------------------------
   ORDER NUMBER GENERATOR
   Format: AAA999 (3 letters + 3 digits)
------------------------------------- */
function generateOrderNumber() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";

    // 3 letters
    for (let i = 0; i < 3; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // 3 digits
    for (let i = 0; i < 3; i++) {
        result += Math.floor(Math.random() * 10);
    }

    return result; // e.g. "AZP012"
}

/* -------------------------------------
   LOAD USER INFO
------------------------------------- */
async function loadUserInfo() {
    const user = apiClient.getUser();
    if (!user) {
        showToast("Please login to checkout", "error");
        return (window.location.href = "../Authentication/login.html");
    }

    try {
        const profile = await apiClient.get("getUserProfile");

        if (!profile) return;

        document.getElementById("email").value = profile.email || "";
        document.getElementById("phone").value = profile.phone_no || "";
        document.getElementById("firstName").value = profile.first_name || "";
        document.getElementById("lastName").value = profile.last_name || "";
    } catch (error) {
        console.error(error);
    }
}

/* -------------------------------------
   LOAD CART + ORDER SUMMARY
------------------------------------- */
let cartItems = [];
let subtotal = 0;

async function loadOrderSummary() {
    const user = apiClient.getUser();
    if (!user) return;

    try {
        const items = await apiClient.get("getCart");
        cartItems = items || [];
    } catch (error) {
        console.error(error);
        cartItems = [];
    }
    subtotal = 0;

    const container = document.getElementById("order-items");
    container.innerHTML = "";

    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;

        container.innerHTML += `
            <div class="order-item">
                <img src="${item.image}" alt="${item.title}">

                <div class="item-info">
                    <p class="item-title">${item.title}</p>
                    <p class="item-qty">${item.quantity} × $${item.price}</p>
                </div>

                <div class="item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `;
    });

    document.getElementById("summary-subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("summary-total").textContent = `$${subtotal.toFixed(2)}`;
}

/* -------------------------------------
   PLACE ORDER
------------------------------------- */
async function placeOrder() {
    const user = apiClient.getUser();

    try {
        const profile = await apiClient.get("getUserProfile");

        if (!profile) {
            showToast("Could not load user info ❌", "error");
            return;
        }

        const address = document.getElementById("address").value;
        const city = document.getElementById("city").value;
        const state = document.getElementById("state").value;
        const zip = document.getElementById("zip_code").value;
        const payment_method = document.getElementById("payment_method").value;

        if (!address || !city || !state || !zip) {
            showToast("Fill all required fields ❌", "error");
            return;
        }

        // Generate unique-ish order number for the user to track
        const order_number = generateOrderNumber();

        await apiClient.post("createOrder", {
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
            phone_no: profile.phone_no,
            subtotal,
            shipping_cost: 0,
            total_amount: subtotal,
            address,
            city,
            state,
            zip_code: zip,
            payment_method,
            payment_status: "Pending",
            items: cartItems,

            // ---------- tracking-related fields ----------
            order_number,
            tracking_status: "Order Placed",
            current_location: "Virtual Paws Warehouse",
            estimated_delivery: null,
            tracking_history: [
                {
                    title: "Order Placed",
                    timestamp: new Date().toISOString(),
                    location: "Virtual Paws Warehouse"
                }
            ]
        });

        // Store order details in localStorage for success page
        localStorage.setItem('lastOrderNumber', order_number);
        localStorage.setItem('lastOrderEmail', profile.email);
        localStorage.setItem('lastOrderTotal', subtotal.toFixed(2));
        localStorage.setItem('lastOrderDate', new Date().toISOString());
        localStorage.setItem('lastOrderStatus', 'Order Placed');

        showToast("Order placed successfully 🎉", "success");

        setTimeout(() => {
            window.location.href = "order-success.html";
        }, 1000);
    } catch (error) {
        console.error(error);
        showToast(error.message || "Order failed ❌", "error");
    }
}

/* -------------------------------------
   INIT
------------------------------------- */
loadUserInfo();
loadOrderSummary();
document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
