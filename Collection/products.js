// ---------------- Supabase Setup ----------------
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


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
async function loadProduct() {
  const id = getProductId();

  if (!id) {
    alert("Missing product id in URL");
    return;
  }

  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("product_id", id)
    .single();

  if (error || !data) {
    console.error("Error loading product:", error);
    alert("Product not found");
    return;
  }

  populateProduct(data);
}


// ---------------- Populate Product ----------------
function populateProduct(p) {
  document.querySelector(".product-title").textContent = p.name;
  document.querySelector(".breadcrumb span").textContent = p.name;
  document.querySelector(".product-price").textContent = "$" + p.price;
  document.querySelector(".product-description").textContent = p.description;

  const stockText = p.stock > 0 ? `⚠ Low stock: ${p.stock} left` : "❌ Out of stock";
  document.querySelector(".availability span:last-child").textContent = stockText;

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
  document.querySelector('[data-section="size"]').nextElementSibling.textContent = p["size chart"];
  document.querySelector('[data-section="care"]').nextElementSibling.textContent = p["care instructions"];

  const usageSec = document.querySelector('[data-section="usage"]');
  if (usageSec) usageSec.nextElementSibling.textContent = p["usage instructions"] || "";
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
function setupQuantitySelector() {
  const qtyDisplay = document.getElementById("quantity");
  const increaseBtn = document.getElementById("increaseQty");
  const decreaseBtn = document.getElementById("decreaseQty");

  let quantity = 1;

  increaseBtn.addEventListener("click", () => {
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: exists } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (exists) {
    heartIcon.textContent = "❤️"; 
  }
}


// ---------------- WISHLIST BUTTON ----------------
function setupWishlistButton(product) {
  const wishlistBtn = document.getElementById("wishlistBtn");
  const heartIcon = document.getElementById("heartIcon");

  wishlistBtn.addEventListener("click", async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      showToast("Please login to add wishlist ❤️", "error");
      return;
    }

    const { data: exists } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", product.product_id)
      .maybeSingle();

    if (exists) {
      heartIcon.textContent = "❤️";
      showToast("Already in your wishlist ❤️", "error");
      return;
    }

    const { error: insertErr } = await supabase.from("wishlist").insert({
      user_id: user.id,
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock_status: product.stock > 0 ? "In Stock" : "Out of Stock",
      rating: product.rating
    });

    if (insertErr) {
      showToast("Failed to add!", "error");
      console.error(insertErr);
      return;
    }

    heartIcon.textContent = "❤️";
    showToast("Added to wishlist!", "success");
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

    const { error } = await supabase.from("product_review").insert({
      product_id: productId,
      name,
      email,
      rating,
      review_text: text
    });

    if (error) {
      console.error("Review submit error:", error);
      alert("Error submitting review.");
      return;
    }

    alert("Review submitted!");
    document.getElementById("reviewModal").classList.remove("active");

    form.reset();
    loadReviews(productId);
  });
}


// ---------------- Load Reviews ----------------
async function loadReviews(productId) {
  const container = document.getElementById("reviewsContainer");
  container.innerHTML = "Loading reviews...";

  const { data, error } = await supabase
    .from("product_review")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = "Failed to load reviews.";
    return;
  }

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
}


// ---------------- ADD TO CART ----------------
function setupAddToCart(product) {
  const addBtn = document.querySelector(".btn.btn-primary"); 

  addBtn.addEventListener("click", async () => {
    const qty = parseInt(document.getElementById("quantity").textContent);

    // Fetch logged-in user
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      showToast("Please login to add to cart ❤️", "error");
      return;
    }

    // Insert real authenticated user
    const { error: insertError } = await supabase.from("cart").insert({
      user_id: user.id,
      product_id: product.product_id,
      title: product.name,
      price: product.price,
      quantity: qty,
      image: product.image
    });

    if (insertError) {
      console.error("Add to cart error:", insertError);
      showToast("Failed to add item to cart ❌", "error");
      return;
    }

    showToast("Added to cart successfully! 🛒", "success");
  });
}


// ---------------- Run Page ----------------
setupCollapsibles();
setupQuantitySelector();
setupReviewModal();
setupStarRating();

const productId = getProductId();

submitReview(productId);
loadProduct();
loadReviews(productId);
  