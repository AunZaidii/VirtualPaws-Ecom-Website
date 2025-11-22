// ---------------- API Client Setup ----------------
import { apiClient } from "../utils/apiClient.js";


// ---------------- GLOBAL TOAST ----------------
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
    toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    document.body.appendChild(toast);
  }

  toast.style.backgroundColor = type === "success" ? "#87da48" : "#ff4d4d";
  toast.textContent = message;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.transition = "opacity 0.4s";
    toast.style.opacity = "0";
  }, 2000);
}


// ---------------- Get Product ID ----------------
function getProductId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id");
}


// ---------------- Load Product ----------------
let currentProduct = null;

async function loadProduct() {
  const id = getProductId(); 
  if (!id) {
    alert("Missing product id in URL");
    return;
  }
  try {
    const response = await fetch(`/.netlify/functions/getSingleProduct?id=${id}`);
    const data = await response.json();
    if (!data) {
      console.error("Product not found");
      alert("Product not found");
      return;
    }
    currentProduct = data;
    populateProduct(data);
    return data;
  } catch (error) {
    console.error("Error loading product:", error);
    alert("Error loading product");
  }
}



// ---------------- Populate Product ----------------
function populateProduct(p) {
  document.querySelector(".product-title").textContent = p.name;
  document.querySelector(".breadcrumb span").textContent = p.name;
  document.querySelector(".product-price").textContent = "Rs " + p.price;
  document.querySelector(".product-description").textContent = p.description;
let stockText = "";

  // Dynamic stock display based on actual stock from database
    if (p.stock === 0) {
      stockText = `<i class="fa-solid fa-xmark" style="color:#ff4d4d;"></i> Out of stock`;
    } 
    else if (p.stock <= 10) {
      stockText = `<i class="fa-solid fa-circle-exclamation" style="color:#ffae00;"></i> Low stock: ${p.stock} left`;
    } 
    else {
      stockText = `<i class="fa-solid fa-check" style="color:#87da48;"></i> In stock: ${p.stock} available`;
    }
  document.querySelector(".availability span:last-child").innerHTML = stockText;


  document.querySelector(".meta-item:nth-child(1) .meta-value").textContent = p.vendor;
  document.querySelector(".meta-item:nth-child(2) .meta-value").textContent = p.category;
  document.querySelector(".meta-item:nth-child(3) .meta-value").textContent = p.tags;

  setupAddToCart(p);
  setupWishlistButton(p);
  checkWishlistStatus(p.product_id);

  const images = [
    { src: p.image, alt: p.imageAlt },
    { src: p.hoverimage, alt: p.hoverimageAlt }
  ].filter(img => img.src);

  const mainImage = document.getElementById("mainImage");
  const thumbnailsDiv = document.querySelector(".thumbnails");
  thumbnailsDiv.innerHTML = "";

  if (images.length > 0) {
    mainImage.src = images[0].src;
    mainImage.alt = images[0].alt;
  }

  images.forEach((img, index) => {
    const div = document.createElement("div");
    div.classList.add("thumbnail");
    if (index === 0) div.classList.add("active");
    div.dataset.index = index;
    div.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    thumbnailsDiv.appendChild(div);
  });

  activateThumbnailEvents(images);

  document.querySelector('[data-section="materials"]').nextElementSibling.textContent = p.material;
}


// ---------------- Thumbnail Logic ----------------
function activateThumbnailEvents(images) {
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("mainImage");

  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener("click", function () {
      const i = this.dataset.index;

      mainImage.src = images[i].src;
      mainImage.alt = images[i].alt;

      thumbnails.forEach(t => t.classList.remove("active"));
      this.classList.add("active");
    });
  });
}


// ---------------- Collapsible Sections ----------------
function setupCollapsibles() {
  const headers = document.querySelectorAll(".collapsible-header");

  headers.forEach(header => {
    header.addEventListener("click", () => {
      const section = header.parentElement;
      section.classList.toggle("open");
    });
  });
}


// ---------------- Quantity Selector ----------------
function setupQuantitySelector(maxStock) {
  const qtyDisplay = document.getElementById("quantity");
  const increaseBtn = document.getElementById("increaseQty");
  const decreaseBtn = document.getElementById("decreaseQty");

  let quantity = 1;

  increaseBtn.addEventListener("click", () => {
    if (maxStock && quantity >= maxStock) {
      showToast(`Maximum stock available: ${maxStock}`, "error");
      return;
    }
    quantity++;
    qtyDisplay.textContent = quantity;
  });

  decreaseBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      qtyDisplay.textContent = quantity;
    }
  });
}


// ---------------- CHECK WISHLIST STATUS ----------------
async function checkWishlistStatus(productId) {
  const heartIcon = document.getElementById("heartIcon");

  const user = apiClient.getUser();
  if (!user) return;

  try {
    const { exists } = await apiClient.get("checkWishlistStatus", { product_id: productId });
    if (exists) {
      heartIcon.classList.remove("fa-regular");
      heartIcon.classList.add("fa-solid");

    }
  } catch (error) {
    console.error("Error checking wishlist status:", error);
  }
}


// ---------------- WISHLIST BUTTON ----------------
function setupWishlistButton(product) {
  const wishlistBtn = document.getElementById("wishlistBtn");
  const heartIcon = document.getElementById("heartIcon");

  wishlistBtn.addEventListener("click", async () => {
    const user = apiClient.getUser();

    if (!user) {
      showToast("Please login to add wishlist ❤️", "error");
      return;
    }

    try {
      const { exists } = await apiClient.get("checkWishlistStatus", { product_id: product.product_id });

      if (exists) {
        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");
        showToast("Already in your wishlist ❤️", "error");
        return;
}


      await apiClient.post("addToWishlist", {
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock_status: product.stock > 0 ? "In Stock" : "Out of Stock",
        rating: product.rating
      });

      heartIcon.classList.replace("fa-regular", "fa-solid");
      showToast("Added to wishlist!", "success");
    } catch (error) {
      showToast(error.message || "Failed to add!", "error");
      console.error(error);
    }
  });
}


// ---------------- Review Modal ----------------
function setupReviewModal() {
  const openBtn = document.getElementById("openReviewModal");
  const closeBtn = document.getElementById("closeReviewModal");
  const modal = document.getElementById("reviewModal");

  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
}


// ---------------- Star Rating ----------------
function setupStarRating() {
  const stars = document.querySelectorAll("#starRating .star");

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const value = parseInt(star.dataset.value);

      stars.forEach((s, i) => {
        s.classList.toggle("active", i < value);
      });

      star.dataset.selected = value;
    });
  });
}


// ---------------- Submit Review ----------------
async function submitReview(productId) {
  const form = document.getElementById("reviewForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("reviewName").value;
    const email = document.getElementById("reviewEmail").value;
    const text = document.getElementById("reviewText").value;
    const rating = document.querySelectorAll("#starRating .star.active").length;

    try {
      await apiClient.post("addProductReview", {
        product_id: productId,
        name,
        email,
        rating,
        review_text: text
      });

      alert("Review submitted!");
      document.getElementById("reviewModal").classList.remove("active");

      form.reset();
      loadReviews(productId);
    } catch (error) {
      console.error("Review submit error:", error);
      alert(error.message || "Error submitting review.");
    }
  });
}


// ---------------- Load Reviews ----------------
async function loadReviews(productId) {
  const container = document.getElementById("reviewsContainer");
  container.innerHTML = "Loading reviews...";

  try {
    const data = await apiClient.get("getProductReviews", { product_id: productId });

    if (!data.length) {
      container.innerHTML = "<p>No reviews yet.</p>";
      return;
    }

    container.innerHTML = "";

    data.forEach((review) => {
      container.innerHTML += `
        <div class="review-item">
          <div class="review-header-row">
            <div class="review-author">${review.name}</div>
            <div class="review-date">${new Date(review.created_at).toDateString()}</div>
          </div>
          <div class="review-stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
          <p class="review-text">${review.review_text}</p>
        </div>
      `;
    });
  } catch (error) {
    container.innerHTML = "Failed to load reviews.";
    console.error(error);
  }
}


// ---------------- ADD TO CART ----------------
function setupAddToCart(product) {
  const addBtn = document.querySelector(".btn.btn-primary"); 
  const buyNowBtn = document.querySelector(".btn.btn-secondary");

  addBtn.addEventListener("click", async () => {
    const qty = parseInt(document.getElementById("quantity").textContent);

    const user = apiClient.getUser();

    if (!user) {
      showToast("Please login to add to cart ❤️", "error");
      return;
    }

    // Check if stock is available
    if (product.stock === 0) {
      showToast("Product is out of stock ❌", "error");
      return;
    }

    if (qty > product.stock) {
      showToast(`Only ${product.stock} items available ⚠️`, "error");
      return;
    }

    try {
      await apiClient.post("addToCart", {
        product_id: product.product_id,
        title: product.name,
        price: product.price,
        quantity: qty,
        image: product.image
      });

      showToast("Added to cart successfully! 🛒", "success");
    } catch (error) {
      console.error("Add to cart error:", error);
      showToast(error.message || "Failed to add item to cart ❌", "error");
    }
  });

  // Buy It Now Button
  buyNowBtn.addEventListener("click", async () => {
    const qty = parseInt(document.getElementById("quantity").textContent);

    const user = apiClient.getUser();

    if (!user) {
      showToast("Please login to continue ❤️", "error");
      setTimeout(() => {
        window.location.href = "../Authentication/login.html";
      }, 1500);
      return;
    }

    // Check if stock is available
    if (product.stock === 0) {
      showToast("Product is out of stock ❌", "error");
      return;
    }

    if (qty > product.stock) {
      showToast(`Only ${product.stock} items available ⚠️`, "error");
      return;
    }

    try {
      // Add to cart
      await apiClient.post("addToCart", {
        product_id: product.product_id,
        title: product.name,
        price: product.price,
        quantity: qty,
        image: product.image
      });

      showToast("Redirecting to cart... 🛒", "success");
      
      // Redirect to cart page
      setTimeout(() => {
        window.location.href = "../cart-and-checkout/cart.html";
      }, 800);
    } catch (error) {
      console.error("Buy now error:", error);
      showToast(error.message || "Failed to process ❌", "error");
    }
  });
}


// ---------------- Run Page ----------------
setupCollapsibles();
setupReviewModal();
setupStarRating();

const productId = getProductId();

submitReview(productId);

// Load product first, then setup quantity selector with stock limit
loadProduct().then((product) => {
  if (product) {
    setupQuantitySelector(product.stock);
  }
});

loadReviews(productId);
  