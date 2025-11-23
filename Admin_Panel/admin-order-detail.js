// Get order ID from query parameter
const urlParams = new URLSearchParams(window.location.search);
const orderNumber = urlParams.get('order');
const orderEmail = urlParams.get('email');

const statusSteps = [
    { name: 'Order Placed', icon: '📦' },
    { name: 'Order Confirmed', icon: '✓' },
    { name: 'Out for Delivery', icon: '🚚' },
    { name: 'Delivered', icon: '✅' }
];

// Fetch order details on load
document.addEventListener('DOMContentLoaded', async () => {
    if (!orderNumber || !orderEmail) {
        document.body.innerHTML = '<h2 style="text-align: center; margin-top: 50px;">Error: Order not found</h2>';
        return;
    }

    await fetchOrderDetails();
});

async function fetchOrderDetails() {
    try {
        const response = await fetch(`/.netlify/functions/trackOrder?order_number=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(orderEmail)}`);
        
        if (!response.ok) {
            throw new Error('Order not found');
        }

        const order = await response.json();
        displayOrderDetails(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        document.body.innerHTML = '<h2 style="text-align: center; margin-top: 50px;">Error loading order details</h2>';
    }
}

function displayOrderDetails(order) {
    // Order Header
    document.getElementById('orderId').textContent = `Order #${order.order_number}`;
    document.getElementById('orderNumber').textContent = order.order_number;
    document.getElementById('orderStatus').textContent = order.tracking_status;
    document.getElementById('orderStatus').className = `status-badge status-${getStatusClass(order.tracking_status)}`;
    document.getElementById('orderTotal').textContent = `$${parseFloat(order.total_amount).toFixed(2)}`;
    document.getElementById('orderDate').textContent = new Date(order.created_at).toLocaleDateString();

    // Customer Information
    document.getElementById('customerName').textContent = `${order.first_name} ${order.last_name}`;
    document.getElementById('customerEmail').textContent = order.email;
    document.getElementById('customerPhone').textContent = order.phone_no || 'N/A';

    // Shipping Address
    document.getElementById('customerAddress').textContent = order.address;
    document.getElementById('customerCity').textContent = order.city;
    document.getElementById('customerState').textContent = order.state;
    document.getElementById('customerZip').textContent = order.zip_code;

    // Payment Information
    document.getElementById('paymentMethod').textContent = order.payment_method || 'N/A';
    
    const paymentStatusEl = document.getElementById('paymentStatus');
    const paymentStatus = order.payment_status || 'Pending';
    paymentStatusEl.textContent = paymentStatus;
    
    // Add color coding for payment status
    if (paymentStatus === 'Paid') {
        paymentStatusEl.style.color = '#16a34a';
        paymentStatusEl.style.fontWeight = '600';
    } else {
        paymentStatusEl.style.color = '#f59e0b';
        paymentStatusEl.style.fontWeight = '600';
    }

    // Order Items
    displayOrderItems(order.items || []);

    // Status Timeline
    displayStatusTimeline(order.tracking_status);

    // Store current order for status updates
    window.currentOrder = order;
}

function displayOrderItems(items) {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';

    if (items.length === 0) {
        itemsList.innerHTML = '<p style="color: #6b7280;">No items in order</p>';
        return;
    }

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="item-image">
            <div class="item-details">
                <div class="item-title">${item.title}</div>
                <div class="item-qty">Quantity: ${item.quantity}</div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
        itemsList.appendChild(itemDiv);
    });
}

function displayStatusTimeline(currentStatus) {
    const timeline = document.getElementById('statusTimeline');
    timeline.innerHTML = '';

    const currentIndex = statusSteps.findIndex(step => step.name === currentStatus);

    statusSteps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'status-step';

        if (index < currentIndex) {
            stepDiv.classList.add('completed');
        } else if (index === currentIndex) {
            stepDiv.classList.add('active');
        }

        // Get timestamp from tracking history
        let timestamp = '';
        if (window.currentOrder && window.currentOrder.tracking_history) {
            const historyEntry = window.currentOrder.tracking_history.find(h => h.title === step.name);
            if (historyEntry) {
                timestamp = new Date(historyEntry.timestamp).toLocaleString();
            }
        }

        stepDiv.innerHTML = `
            <div class="step-icon">${index < currentIndex ? '✓' : index + 1}</div>
            <div>
                <div class="step-label">${step.name}</div>
                ${timestamp ? `<div class="step-time">${timestamp}</div>` : ''}
            </div>
        `;

        timeline.appendChild(stepDiv);
    });

    // Update button states
    updateButtonStates(currentIndex);
}

function updateButtonStates(currentIndex) {
    const confirmedBtn = document.querySelector('.btn-confirmed');
    const transitBtn = document.querySelector('.btn-transit');
    const deliveredBtn = document.querySelector('.btn-delivered');
    const backBtn = document.querySelector('.btn-back');

    confirmedBtn.disabled = currentIndex >= 1;
    transitBtn.disabled = currentIndex >= 2;
    deliveredBtn.disabled = currentIndex >= 3;
    backBtn.disabled = currentIndex <= 0;
}

function getStatusClass(status) {
    const classMap = {
        'Order Placed': 'pending',
        'Order Confirmed': 'confirmed',
        'Out for Delivery': 'transit',
        'Delivered': 'delivered'
    };
    return classMap[status] || 'pending';
}

// Rider Selection Modal
let allRiders = [];
let selectedRider = null;

async function updateStatus(newStatus) {
    if (!window.currentOrder) return;

    // If updating to "Order Confirmed", show rider selection modal
    if (newStatus === 'Order Confirmed') {
        await openRiderModal();
        return;
    }

    // Otherwise, update status normally
    await performStatusUpdate(newStatus);
}

async function openRiderModal() {
    try {
        // Fetch all riders
        const response = await fetch('/.netlify/functions/getRiders');
        const data = await response.json();

        if (data.success) {
            allRiders = data.riders || [];
            displayRiders();
            document.getElementById('riderModal').classList.add('active');
        } else {
            alert('Failed to load riders. Please try again.');
        }
    } catch (error) {
        console.error('Error loading riders:', error);
        alert('Error loading riders. Please try again.');
    }
}

function displayRiders() {
    const ridersGrid = document.getElementById('ridersGrid');
    ridersGrid.innerHTML = '';

    if (allRiders.length === 0) {
        ridersGrid.innerHTML = '<p style="text-align: center; color: #6b7280; grid-column: 1/-1;">No riders available. Please add riders first.</p>';
        return;
    }

    allRiders.forEach(rider => {
        const riderCard = document.createElement('div');
        riderCard.className = 'rider-card';
        riderCard.onclick = () => selectRider(rider.rider_id);
        riderCard.dataset.riderId = rider.rider_id;

        riderCard.innerHTML = `
            <div class="rider-image-container">
                ${rider.rider_image ? `<img src="${rider.rider_image}" alt="${rider.rider_name}">` : '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 48px; color: #9ca3af;">👤</div>'}
            </div>
            <div class="rider-name">${rider.rider_name}</div>
            <div class="rider-info">
                <i class="fas fa-phone"></i> ${rider.rider_phone}
            </div>
            <div class="rider-info">
                <i class="fas fa-motorcycle"></i> ${rider.numberplate}
            </div>
        `;

        ridersGrid.appendChild(riderCard);
    });
}

function selectRider(riderId) {
    // Remove previous selection
    document.querySelectorAll('.rider-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selection to clicked card
    const selectedCard = document.querySelector(`[data-rider-id="${riderId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Store selected rider
    selectedRider = allRiders.find(r => r.rider_id === riderId);
    
    // Enable confirm button
    document.getElementById('confirmRiderBtn').disabled = false;
}

function closeRiderModal() {
    document.getElementById('riderModal').classList.remove('active');
    selectedRider = null;
    document.getElementById('confirmRiderBtn').disabled = true;
}

window.closeRiderModal = closeRiderModal;

async function confirmRiderAssignment() {
    if (!selectedRider) {
        alert('Please select a rider');
        return;
    }

    console.log('Selected rider:', selectedRider);
    console.log('Current order:', window.currentOrder);

    try {
        // Assign rider to order
        const assignResponse = await fetch('/.netlify/functions/assignRiderToOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_id: window.currentOrder.order_id,
                rider_id: selectedRider.rider_id,
                rider_name: selectedRider.rider_name,
                rider_phone: selectedRider.rider_phone,
                rider_image: selectedRider.rider_image || null,
            })
        });

        const assignData = await assignResponse.json();

        if (!assignData.success) {
            throw new Error(assignData.error || 'Failed to assign rider');
        }

        // Store rider name before closing modal
        const riderName = selectedRider.rider_name;

        // Update order status to "Order Confirmed"
        await performStatusUpdate('Order Confirmed');

        // Close modal
        closeRiderModal();

        alert(`Rider ${riderName} assigned successfully!`);
    } catch (error) {
        console.error('Error assigning rider:', error);
        alert('Error assigning rider: ' + error.message);
    }
}

window.confirmRiderAssignment = confirmRiderAssignment;

async function performStatusUpdate(newStatus) {
    try {
        console.log('Updating order status to:', newStatus);
        
        const response = await fetch('/.netlify/functions/updateOrderStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_number: window.currentOrder.order_number,
                email: window.currentOrder.email,
                tracking_status: newStatus,
                location: window.currentOrder.current_location || 'Virtual Paws Warehouse'
            })
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response body:', result);

        if (!response.ok) {
            throw new Error(result.error || 'Failed to update status');
        }

        window.currentOrder = result;
        document.getElementById('orderStatus').textContent = result.tracking_status;
        document.getElementById('orderStatus').className = `status-badge status-${getStatusClass(result.tracking_status)}`;
        
        displayStatusTimeline(result.tracking_status);

        // Show success message
        alert(`Order status updated to: ${result.tracking_status}`);
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating order status: ' + error.message);
    }
}

async function revertStatus() {
    if (!window.currentOrder) return;

    const currentStatus = window.currentOrder.tracking_status;
    const currentIndex = statusSteps.findIndex(step => step.name === currentStatus);

    if (currentIndex <= 0) {
        alert('Cannot revert from initial status');
        return;
    }

    const previousStatus = statusSteps[currentIndex - 1].name;

    try {
        console.log('Reverting order status from:', currentStatus, 'to:', previousStatus);
        
        const response = await fetch('/.netlify/functions/updateOrderStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_number: window.currentOrder.order_number,
                email: window.currentOrder.email,
                tracking_status: currentStatus,
                location: window.currentOrder.current_location || 'Virtual Paws Warehouse',
                revert: true
            })
        });

        console.log('Revert response status:', response.status);
        const result = await response.json();
        console.log('Revert response body:', result);

        if (!response.ok) {
            throw new Error(result.error || 'Failed to revert status');
        }

        window.currentOrder = result;
        document.getElementById('orderStatus').textContent = result.tracking_status;
        document.getElementById('orderStatus').className = `status-badge status-${getStatusClass(result.tracking_status)}`;
        
        displayStatusTimeline(result.tracking_status);
        alert(`Order status reverted to: ${result.tracking_status}`);
    } catch (error) {
        console.error('Error reverting status:', error);
        alert('Error reverting order status: ' + error.message);
    }
}

function goBack() {
    window.location.href = 'Admin.html?section=view-orders';
}
