import { apiClient } from "../utils/apiClient.js";
import { requireAuth } from "../utils/authGuard.js";

// Check authentication before loading wishlist
await requireAuth();

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
  const user = apiClient.getUser();

  if (!user) {
    document.getElementById("emptyState").style.display = "block";
    document.getElementById("wishlistGrid").innerHTML = "";
    return;
  }

  try {
    const data = await apiClient.get("getWishlist");
    renderWishlist(data || []);
  } catch (error) {
    console.error(error);
    document.getElementById("emptyState").style.display = "block";
    document.getElementById("wishlistGrid").innerHTML = "";
  }
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
  try {
    await apiClient.delete("removeFromWishlist", { id });
    showToast("Item removed from wishlist");
    loadWishlist();
  } catch (error) {
    showToast(error.message || "Error removing item", "error");
  }
}

// ---------------- Add To Cart ----------------
async function addToCart(id) {
  const user = apiClient.getUser();
  if (!user) return showToast("Please login to add items.", "error");

  try {
    // Get wishlist item
    const wishlist = await apiClient.get("getWishlist");
    const item = wishlist.find(w => w.id === id);

    if (!item) {
      showToast("Item not found", "error");
      return;
    }

    // Add to cart
    await apiClient.post("addToCart", {
      product_id: item.product_id,
      title: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });

    showToast("Added to cart!");
  } catch (error) {
    showToast(error.message || "Error adding to cart", "error");
  }
}

window.removeItem = removeItem;
window.addToCart = addToCart;

// ---------------- Init ----------------
loadWishlist();
