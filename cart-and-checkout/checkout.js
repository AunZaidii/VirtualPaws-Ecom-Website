import { apiClient } from "../utils/apiClient.js";
import { requireAuth } from "../utils/authGuard.js";

// Check authentication before loading checkout
await requireAuth();

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
        
        // Auto-fill address in the address field only
        if (profile.address) {
            document.getElementById("address").value = profile.address;
        }
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
        console.log("Cart items loaded:", cartItems);
    } catch (error) {
        console.error("Error loading cart:", error);
        cartItems = [];
    }
    
    subtotal = 0;

    const container = document.getElementById("order-items");
    if (!container) {
        console.error("Order items container not found!");
        return;
    }
    container.innerHTML = "";

    if (cartItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">Your cart is empty</p>';
    } else {
        cartItems.forEach(item => {
            subtotal += item.price * item.quantity;

            container.innerHTML += `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.title}">

                    <div class="item-info">
                        <p class="item-title">${item.title}</p>
                        <p class="item-qty">${item.quantity} × Rs ${item.price}</p>
                    </div>

                    <div class="item-total">
                        Rs ${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            `;
        });
    }

    const subtotalEl = document.getElementById("summary-subtotal");
    const totalEl = document.getElementById("summary-total");
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
    
    console.log("Order summary updated. Subtotal:", subtotal);
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

        // Update user address in database if it's not already saved or has changed
        if (!profile.address || profile.address !== address) {
            try {
                await apiClient.put("updateUserProfile", {
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    phone_no: profile.phone_no,
                    address: address
                });
                console.log("Address saved to user profile");
            } catch (updateError) {
                console.error("Failed to update address:", updateError);
                // Continue with order even if address update fails
            }
        }

        // Generate unique order number
        const order_number = generateOrderNumber();

        // Determine payment status based on method
        let paymentStatus = "Pending";
        
        // If Credit Card is selected, validate and process payment
        if (payment_method === "Credit Card") {
            if (!validateCardDetails()) {
                return;
            }

            showToast("Processing payment... 💳", "success");

            const orderData = {
                email: profile.email,
                address: address,
                city: city,
                state: state,
                zip_code: zip,
                orderNumber: order_number
            };

            const paymentSuccess = await processStripePayment(orderData, subtotal);
            
            if (!paymentSuccess) {
                return;
            }

            // If payment successful, update status
            paymentStatus = "Paid";
            showToast("Payment completed successfully! ✅", "success");
        }

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
            payment_status: paymentStatus,
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
   STRIPE CONFIGURATION
------------------------------------- */
import { getConfig } from '../utils/config.js';
let stripe, elements;
let cardNumberElement, cardExpiryElement, cardCvcElement;

// Initialize Stripe after config is loaded
const config = await getConfig();
stripe = Stripe(config.stripe.publishableKey);
elements = stripe.elements();

/* -------------------------------------
   INITIALIZE STRIPE ELEMENTS
------------------------------------- */
function initializeStripeElements() {
    const elementStyles = {
        base: {
            fontSize: '15px',
            color: '#32325d',
            fontFamily: '"Nunito", sans-serif',
            '::placeholder': {
                color: '#9ca3af',
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    };

    const elementClasses = {
        base: 'stripe-element',
        focus: 'stripe-element-focus',
        invalid: 'stripe-element-invalid',
    };

    // Create card elements
    cardNumberElement = elements.create('cardNumber', {
        style: elementStyles,
        classes: elementClasses,
        placeholder: '1234 5678 9012 3456',
    });

    cardExpiryElement = elements.create('cardExpiry', {
        style: elementStyles,
        classes: elementClasses,
    });

    cardCvcElement = elements.create('cardCvc', {
        style: elementStyles,
        classes: elementClasses,
        placeholder: '123',
    });

    // Mount elements when card section is visible
    if (document.getElementById("payment_method").value === "Credit Card") {
        mountStripeElements();
    }
}

/* -------------------------------------
   MOUNT/UNMOUNT STRIPE ELEMENTS
------------------------------------- */
function mountStripeElements() {
    // Mount Stripe Elements to containers
    cardNumberElement.mount('#card-number-element');
    cardExpiryElement.mount('#card-expiry-element');
    cardCvcElement.mount('#card-cvc-element');
}

function unmountStripeElements() {
    if (cardNumberElement) cardNumberElement.unmount();
    if (cardExpiryElement) cardExpiryElement.unmount();
    if (cardCvcElement) cardCvcElement.unmount();
}

/* -------------------------------------
   PAYMENT METHOD TOGGLE
------------------------------------- */
function toggleCardInput() {
    const paymentMethod = document.getElementById("payment_method").value;
    const cardSection = document.getElementById("card-input-section");
    
    if (paymentMethod === "Credit Card") {
        cardSection.style.display = "block";
        mountStripeElements();
    } else {
        cardSection.style.display = "none";
        unmountStripeElements();
    }
}

/* -------------------------------------
   VALIDATE CARD DETAILS
------------------------------------- */
function validateCardDetails() {
    const cardHolder = document.getElementById("card-holder").value;

    if (!cardHolder.trim()) {
        showToast("Cardholder name required ❌", "error");
        return false;
    }

    return true;
}

/* -------------------------------------
   PROCESS STRIPE PAYMENT
------------------------------------- */
async function processStripePayment(orderData, totalAmount) {
    const cardHolder = document.getElementById("card-holder").value;

    try {
        // Create payment method with Stripe Elements
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumberElement,
            billing_details: {
                name: cardHolder,
                email: orderData.email,
                address: {
                    line1: orderData.address,
                    city: orderData.city,
                    state: orderData.state,
                    postal_code: orderData.zip_code,
                }
            },
        });

        if (error) {
            console.error("Stripe error:", error);
            showToast(error.message || "Payment failed ❌", "error");
            return false;
        }

        // Process payment through backend
        const paymentResult = await apiClient.post("createStripePayment", {
            amount: totalAmount,
            currency: 'usd',
            paymentMethodId: paymentMethod.id,
            email: orderData.email,
            description: `Virtual Paws Order - ${orderData.orderNumber || 'New Order'}`
        });

        if (paymentResult.success) {
            console.log("Payment successful:", paymentResult);
            showToast("Payment successful ✅", "success");
            return true;
        } else {
            showToast("Payment failed ❌", "error");
            return false;
        }

    } catch (err) {
        console.error("Payment processing error:", err);
        showToast(err.message || "Payment processing failed ❌", "error");
        return false;
    }
}

/* -------------------------------------
   INIT
------------------------------------- */
loadUserInfo();
loadOrderSummary();
initializeStripeElements();
document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
document.getElementById("payment_method").addEventListener("change", toggleCardInput);

// Initialize card section visibility
toggleCardInput();
