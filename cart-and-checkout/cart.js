import { apiClient } from "../utils/apiClient.js";


// -----------------------------------------------------
// LOAD CART ITEMS
// -----------------------------------------------------
async function loadCart() {
    const user = apiClient.getUser();

    if (!user) {
        document.getElementById("cart-items").innerHTML =
            "<p>Your cart is empty.</p>";
        return;
    }

    try {
        const items = await apiClient.get("getCart");
        renderCart(items || []);
    } catch (error) {
        console.error(error);
        document.getElementById("cart-items").innerHTML =
            "<p>Your cart is empty.</p>";
    }
}


// -----------------------------------------------------
// RENDER ITEMS (MATCHES YOUR CSS EXACTLY)
// -----------------------------------------------------
function renderCart(items) {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    if (!items || items.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("subtotal").textContent = "$0.00";
        return;
    }

    let subtotal = 0;

    items.forEach(item => {
        subtotal += item.price * item.quantity;

        const row = document.createElement("div");
        row.classList.add("product-row");

        row.innerHTML = `
            <div class="product-info">
                <div class="product-image">
                    <img src="${item.image}" alt="Product">
                </div>

                <div class="product-details">
                    <p class="product-title">${item.title}</p>
                    <p class="product-price">$${item.price}</p>
                </div>
            </div>

            <div class="quantity-controls">
                <div class="quantity-selector">
                    <button class="quantity-btn" onclick="updateQuantity('${item.cart_id}', ${item.quantity - 1})">
                        <svg class="icon" viewBox="0 0 24 24"><path d="M20 12H4"/></svg>
                    </button>

                    <span class="quantity-number">${item.quantity}</span>

                    <button class="quantity-btn" onclick="updateQuantity('${item.cart_id}', ${item.quantity + 1})">
                        <svg class="icon" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                    </button>
                </div>

                <button class="delete-btn" onclick="deleteItem('${item.cart_id}')">
                    <svg class="icon-trash" viewBox="0 0 24 24">
                        <path d="M19 7l-1 12H6L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16"/>
                    </svg>
                </button>
            </div>

            <div class="total-price">
                Rs ${(item.price * item.quantity).toFixed(2)}
            </div>
        `;

        container.appendChild(row);
    });

    document.getElementById("subtotal").textContent = `Rs ${subtotal.toFixed(2)}`;
}


// -----------------------------------------------------
// UPDATE QUANTITY
// -----------------------------------------------------
async function updateQuantity(cart_id, qty) {
    if (qty < 1) qty = 1;

    try {
        await apiClient.put("updateCart", { cart_id, quantity: qty });
        loadCart();
    } catch (error) {
        console.error(error);
    }
}


// -----------------------------------------------------
// DELETE ITEM
// -----------------------------------------------------
async function deleteItem(cart_id) {
    try {
        await apiClient.delete("deleteCartItem", { cart_id });
        loadCart();
    } catch (error) {
        console.error(error);
    }
}


// -----------------------------------------------------
// INITIALIZE
// -----------------------------------------------------
loadCart();

window.updateQuantity = updateQuantity;
window.deleteItem = deleteItem;
