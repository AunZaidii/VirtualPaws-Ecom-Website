// --- Supabase Setup ---
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// --- Load Cart ---
async function loadCart() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("You must login to view your cart.");
        return;
    }

    const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id);

    if (error) {
        console.error(error);
        return;
    }

    renderCart(data);
}


// --- Render Cart UI ---
function renderCart(data) {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    let subtotal = 0;

    data.forEach(item => {
        subtotal += item.price * item.quantity;

        const row = document.createElement("div");
        row.classList.add("product-row");

        row.innerHTML = `
            <div class="product-info">
                <img src="${item.image}" class="cart-img">
                <div>
                    <p class="product-title">${item.title}</p>
                    <p class="product-price">$${item.price}</p>
                </div>
            </div>

            <div class="quantity-controls">
                <button onclick="updateQuantity('${item.cart_id}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.cart_id}', ${item.quantity + 1})">+</button>

                <button class="delete-btn" onclick="deleteItem('${item.cart_id}')">🗑</button>
            </div>

            <div class="total-price">$${(item.price * item.quantity).toFixed(2)}</div>
        `;

        container.appendChild(row);
    });

    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
}


// --- Update Quantity ---
async function updateQuantity(cart_id, qty) {
    if (qty < 1) qty = 1;

    await supabase
        .from("cart")
        .update({ quantity: qty })
        .eq("cart_id", cart_id);

    loadCart();
}


// --- Delete Item ---
async function deleteItem(cart_id) {
    await supabase
        .from("cart")
        .delete()
        .eq("cart_id", cart_id);

    loadCart();
}


// --- Init ---
loadCart();
