function showHomePage(event) {
    if (event) event.preventDefault();
    document.getElementById('homePage').classList.add('active');
    document.getElementById('trackOrderPage').classList.remove('active');
    window.scrollTo(0, 0);
}

function showTrackOrderPage(event) {
    if (event) event.preventDefault();
    document.getElementById('homePage').classList.remove('active');
    document.getElementById('trackOrderPage').classList.add('active');
    window.scrollTo(0, 0);
}

function trackOrder(event) {
    event.preventDefault();
    
    const orderNumber = document.getElementById('orderNumber').value;
    const email = document.getElementById('email').value;
    const errorDiv = document.getElementById('formError');
    
    if (!orderNumber || !email) {
        errorDiv.textContent = 'Please enter both order number and email address';
        errorDiv.classList.add('show');
        return;
    }
    
    errorDiv.classList.remove('show');
    
    const trackingNumber = 'VPW' + Math.random().toString(36).substring(2, 12).toUpperCase();
    
    document.getElementById('orderIdDisplay').textContent = 'Order #' + orderNumber;
    document.getElementById('trackingNumberDisplay').textContent = 'Tracking Number: ' + trackingNumber;
    document.getElementById('orderStatusText').textContent = 'In Transit';
    document.getElementById('currentLocation').textContent = 'Distribution Center - Your City';
    document.getElementById('estimatedDelivery').textContent = 'November 14, 2025';
    
    generateTimeline();
    
    document.getElementById('trackOrderForm').style.display = 'none';
    document.getElementById('orderStatus').style.display = 'block';
}

function generateTimeline() {
    const timelineData = [
        {
            status: 'Order Placed',
            date: 'Nov 9, 2025',
            time: '10:30 AM',
            location: 'Virtual Paws',
            completed: true
        },
        {
            status: 'Order Confirmed',
            date: 'Nov 9, 2025',
            time: '11:00 AM',
            location: 'Virtual Paws',
            completed: true
        },
        {
            status: 'Shipped',
            date: 'Nov 10, 2025',
            time: '2:15 PM',
            location: 'Warehouse - Main Branch',
            completed: true
        },
        {
            status: 'In Transit',
            date: 'Nov 11, 2025',
            time: '9:00 AM',
            location: 'Distribution Center',
            completed: true
        },
        {
            status: 'Out for Delivery',
            date: 'Nov 14, 2025',
            time: 'Pending',
            location: 'Your City',
            completed: false
        },
        {
            status: 'Delivered',
            date: 'Nov 14, 2025',
            time: 'Pending',
            location: 'Your Address',
            completed: false
        }
    ];
    
    const timelineContainer = document.getElementById('timeline');
    timelineContainer.innerHTML = '';
    
    timelineData.forEach((item, index) => {
        const isLast = index === timelineData.length - 1;
        const iconClass = item.completed ? 'completed' : 'pending';
        
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        timelineItem.innerHTML = `
            <div class="timeline-marker">
                <div class="timeline-icon ${iconClass}">
                    ${getTimelineIcon(item.status)}
                </div>
                ${!isLast ? `<div class="timeline-line ${iconClass}"></div>` : ''}
            </div>
            <div class="timeline-content ${iconClass}">
                <div>${item.status}</div>
                <div class="timeline-date">
                    ${item.date} ${item.time !== 'Pending' ? 'at ' + item.time : ''}
                </div>
                <div class="timeline-location">${item.location}</div>
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

function getTimelineIcon(status) {
    const icons = {
        'Order Placed': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        'Order Confirmed': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        'Shipped': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>',
        'In Transit': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
        'Out for Delivery': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
        'Delivered': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    };
    
    return icons[status] || icons['Order Placed'];
}

function resetTrackingForm() {
    document.getElementById('trackOrderForm').style.display = 'block';
    document.getElementById('orderStatus').style.display = 'none';
    document.getElementById('orderNumber').value = '';
    document.getElementById('email').value = '';
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', function() {
    showHomePage();
});
