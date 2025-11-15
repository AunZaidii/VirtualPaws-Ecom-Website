// ---------------- Supabase Setup ----------------
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


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

  // Meta fields
  document.querySelector(".meta-item:nth-child(1) .meta-value").textContent = p.vendor;
  document.querySelector(".meta-item:nth-child(2) .meta-value").textContent = p.category;
  document.querySelector(".meta-item:nth-child(3) .meta-value").textContent = p.tags;

  // Images
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

  // Collapsible content
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


// ---------------- Run Page ----------------
setupCollapsibles();
setupQuantitySelector();
setupReviewModal();
setupStarRating();

const productId = getProductId();

submitReview(productId);
loadProduct();
loadReviews(productId);
