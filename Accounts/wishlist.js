import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------------- Toast ----------------
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast active ${type}`;

  setTimeout(() => (toast.className = "toast"), 2200);
}

function renderStars(rating) {
  rating = Number(rating) || 0;
  
  let full = Math.floor(rating);
  let half = rating % 1 !== 0;
  let html = "";

  for (let i = 0; i < full; i++)
    html += `<i class="fa-solid fa-star" style="color:#facc15;"></i>`;

  if (half)
    html += `<i class="fa-solid fa-star-half-stroke" style="color:#facc15;"></i>`;

  for (let i = full + (half ? 1 : 0); i < 5; i++)
    html += `<i class="fa-regular fa-star" style="color:#d1d5db;"></i>`;

  return html;
}


// ---------------- Load Wishlist ----------------
async function loadWishlist() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    document.getElementById("emptyState").style.display = "block";
    document.getElementById("wishlistGrid").innerHTML = "";
    return;
  }

  const { data, error } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return;
  }

  renderWishlist(data);
}

// ---------------- Render Wishlist ----------------
function renderWishlist(items) {
  const grid = document.getElementById("wishlistGrid");
  const empty = document.getElementById("emptyState");
  const count = document.getElementById("wishlistCount");

  if (!items.length) {
    empty.style.display = "block";
    grid.innerHTML = "";
    count.textContent = "";
    return;
  }

  empty.style.display = "none";
  count.textContent = `${items.length} item${items.length === 1 ? "" : "s"} in your wishlist`;

 grid.innerHTML = items
  .map(
    (item) => `
      <div class="wishlist-item">
        
        <div class="item-image-container">
          <img src="${item.image}" class="item-image">

          <button class="remove-btn" onclick="removeItem(${item.id})">
            <i class="fa-solid fa-xmark"></i>
          </button>

          ${
            item.stock_status === "Out of Stock"
              ? `
            <div class="out-of-stock-overlay">
              <span class="out-of-stock-badge">Out of Stock</span>
            </div>`
              : ""
          }
        </div>

        <div class="item-details">
          <h3 class="item-name">${item.name}</h3>

          <!-- ⭐ PRODUCT RATING ADDED HERE -->
          <div class="item-rating">
            ${renderStars(item.rating)}
          </div>

          <p class="item-price">$${item.price}</p>

          <button 
            class="add-to-cart-btn"
            onclick="addToCart(${item.id})"
            ${item.stock_status === "Out of Stock" ? "disabled" : ""}
          >
            <i class="fa-solid fa-cart-shopping"></i> Add to Cart
          </button>
        </div>

      </div>
    `
  )
  .join("");
}

// ---------------- Remove Item ----------------
async function removeItem(id) {
  const { error } = await supabase.from("wishlist").delete().eq("id", id);

  if (error) return showToast("Error removing item", "error");

  showToast("Item removed from wishlist");
  loadWishlist();
}

// ---------------- Add To Cart ----------------
async function addToCart(id) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return showToast("Please login to add items.", "error");

  // Find wishlist item
  const { data } = await supabase.from("wishlist").select("*").eq("id", id).single();

  // Add to cart table
  await supabase.from("cart").insert({
    user_id: user.id,
    product_id: data.product_id,
    title: data.name,
    price: data.price,
    quantity: 1,
    image: data.image,
  });

  showToast("Added to cart!");
}

window.removeItem = removeItem;
window.addToCart = addToCart;

// ---------------- Init ----------------
loadWishlist();
