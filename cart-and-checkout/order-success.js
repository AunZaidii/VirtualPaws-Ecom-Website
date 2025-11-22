// Fetch and display order details from Supabase orders table
document.addEventListener('DOMContentLoaded', async function() {
    const orderNumber = localStorage.getItem('lastOrderNumber');
    const userEmail = localStorage.getItem('lastOrderEmail');

    console.log('Fetching order details:', { orderNumber, userEmail });

    if (!orderNumber || !userEmail) {
        console.error('No order number or email found in localStorage');
        return;
    }

    try {
        // Fetch order from Supabase using the trackOrder function
        // This calls the netlify function which queries: order_number and email
        const response = await fetch(`/.netlify/functions/trackOrder?order_number=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(userEmail)}`);
        
        if (!response.ok) {
            console.error('Failed to fetch order:', response.status, response.statusText);
            return;
        }

        const order = await response.json();

        console.log('Order fetched from database:', order);

        if (!order) {
            console.error('Order not found in database');
            return;
        }

        const orderInfoDiv = document.querySelector('.order-info');
        if (!orderInfoDiv) {
            console.error('Order info div not found');
            return;
        }

        // Display order_number from database (using lowercase field name) - without hash
        const orderNumberRow = document.createElement('div');
        orderNumberRow.className = 'order-info-row';
        orderNumberRow.innerHTML = `
            <span class="order-info-label">Order Number:</span>
            <span class="order-info-value">${order.order_number}</span>
        `;
        orderInfoDiv.insertBefore(orderNumberRow, orderInfoDiv.firstChild);
        console.log('Order number inserted:', order.order_number);

        // Update tracking_status from database (using lowercase field name)
        const statusRows = orderInfoDiv.querySelectorAll('.order-info-row');
        if (statusRows.length > 1) {
            const statusValue = statusRows[1].querySelector('.order-info-value');
            if (statusValue) {
                // Using correct field name: tracking_status
                statusValue.textContent = order.tracking_status || 'Order Placed';
                console.log('Tracking status updated:', order.tracking_status);
            }
        }

        // Display order date (created_at from database)
        if (order.created_at) {
            const orderDateRow = document.createElement('div');
            orderDateRow.className = 'order-info-row';
            const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            orderDateRow.innerHTML = `
                <span class="order-info-label">Order Date:</span>
                <span class="order-info-value">${formattedDate}</span>
            `;
            orderInfoDiv.appendChild(orderDateRow);
        }

        // Display order total
        if (order.total_amount) {
            const orderTotalRow = document.createElement('div');
            orderTotalRow.className = 'order-info-row';
            orderTotalRow.innerHTML = `
                <span class="order-info-label">Order Total:</span>
                <span class="order-info-value">Rs ${parseFloat(order.total_amount).toFixed(2)}</span>
            `;
            orderInfoDiv.appendChild(orderTotalRow);
        }

        // Display order email
        if (order.email) {
            const emailNoticeDiv = document.querySelector('.email-notice');
            if (emailNoticeDiv) {
                const emailSpan = document.createElement('div');
                emailSpan.style.marginTop = '0.8vw';
                emailSpan.style.fontSize = '0.9vw';
                emailSpan.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Confirmation sent to: <strong>${order.email}</strong>
                `;
                emailNoticeDiv.appendChild(emailSpan);
            }
        }

        // Log tracking_history for debugging (this will contain order updates)
        if (order.tracking_history && order.tracking_history.length > 0) {
            console.log('Tracking History from database:', order.tracking_history);
        }

    } catch (error) {
        console.error('Error fetching order details from Supabase:', error);
    }
});
