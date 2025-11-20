import { supabaseClient } from "../SupabaseClient/supabaseClient.js";

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
   LOAD USER INFO
------------------------------------- */
async function loadUserInfo() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (!user) {
        showToast("Please login to checkout", "error");
        return (window.location.href = "../Authentication/login.html");
    }

    const { data: profile } = await supabaseClient
        .from("user")
        .select("*")
        .eq("user_id", user.id)   // ✔ FIXED
        .single();

    if (!profile) return;

    document.getElementById("email").value = profile.email || "";
    document.getElementById("phone").value = profile.phone_no || "";
    document.getElementById("firstName").value = profile.first_name || "";
    document.getElementById("lastName").value = profile.last_name || "";
}

/* -------------------------------------
   LOAD CART + ORDER SUMMARY
------------------------------------- */
let cartItems = [];
let subtotal = 0;

async function loadOrderSummary() {
    const { data: { user }} = await supabaseClient.auth.getUser();
    if (!user) return;

    const { data: items } = await supabaseClient
        .from("cart")
        .select("*")
        .eq("user_id", user.id);   // ✔ FIXED

    cartItems = items || [];
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
    const { data: { user } } = await supabaseClient.auth.getUser();

    const { data: profile, error: profileErr } = await supabaseClient
        .from("user")
        .select("first_name, last_name, email, phone_no")
        .eq("user_id", user.id)   // ✔ FIXED
        .single();

    if (profileErr) {
        console.error(profileErr);
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

    const { error } = await supabaseClient.from("orders").insert({
        user_id: user.id,   // ✔ FIXED
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone_no,

        subtotal,
        shipping_cost: 0,
        total_amount: subtotal,
        address,
        city,
        state,
        zip_code: zip,
        payment_method,
        payment_status: "Pending",
        items: cartItems
    });

    if (error) {
        console.error(error);
        showToast("Order failed ❌", "error");
        return;
    }

    await supabaseClient.from("cart").delete().eq("user_id", user.id);  // ✔ FIXED

    showToast("Order placed successfully 🎉", "success");

    setTimeout(() => {
        window.location.href = "order-success.html";
    }, 1000);
}

/* -------------------------------------
   INIT
------------------------------------- */
loadUserInfo();
loadOrderSummary();
document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
