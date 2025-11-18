import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// --- SUPABASE ---
const supabase = createClient(
  "https://oekreylufrqvuzgoyxye.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8"
);

// --- TARGET DIVS ---
const latestBox = document.getElementById("latestProducts");
const featuredBox = document.getElementById("featuredProducts");
const dealsBox = document.getElementById("dealsProducts");

// ======================================================
//  LOAD PRODUCTS
// ======================================================
async function loadProducts() {
  const { data: products, error } = await supabase.from("product").select("*");

  if (error) {
    console.error("SUPABASE ERROR:", error);
    return;
  }
  if (!products || !products.length) {
    console.warn("No products found");
    return;
  }

  // Random order
  const shuffled = [...products].sort(() => 0.5 - Math.random());

  renderLatest(shuffled.slice(0, 5));
  renderFeatured(shuffled.slice(5, 9));
  renderDeals(shuffled.slice(9, 14));
}

// ======================================================
//  PRODUCT CARD TEMPLATES
// ======================================================
function productCard(p) {
  return `
    <a href="../Collection/Products.html?id=${p.product_id}" class="card-link">
      <div class="product-div">
        <div class="product-image-div">
          <img class="product-image" src="${p.image}" alt="${p.name}">
          <img class="product-image-hover" src="${p.hoverimage}" alt="${p.name}">
        </div>

        <div class="product-text-div">
          <p class="product-text-title">${p.name}</p>
          <p class="product-text-rating">${renderStars(p.rating)}</p>
          <p class="product-text-price">
            <span class="green-price">$${p.price}</span>
          </p>
        </div>
      </div>
    </a>
  `;
}

function featuredCard(p) {
  return `
    <a href="../Collection/Products.html?id=${p.product_id}" class="card-link">
      <div class="best-product-flexbox">
        <div class="best-product-image-div">
          <img class="best-product-image" src="${p.image}">
          <img class="best-product-image-hover" src="${p.hoverimage}">
        </div>

        <div class="best-product-text-div">
          <p class="best-product-text-title">${p.name}</p>
          <p class="best-product-text-rating">${renderStars(p.rating)}</p>

          <p class="best-product-text-price">
            <span class="green-price">$${p.price}</span>
          </p>

          <p class="best-product-addtocart">Add To Cart</p>
        </div>
      </div>
    </a>
  `;
}

// ======================================================
//  STAR RENDERER
// ======================================================
function renderStars(rating) {
  let html = "";
  if (!rating) rating = 0;

  for (let i = 0; i < Math.floor(rating); i++) {
    html += `<i class="fa-solid fa-star"></i>`;
  }
  if (rating % 1 !== 0) {
    html += `<i class="fa-solid fa-star-half-stroke"></i>`;
  }
  return html;
}

// ======================================================
//  RENDER SECTIONS
// ======================================================
function renderLatest(arr) {
  latestBox.innerHTML = arr.map(productCard).join("");
}

function renderFeatured(arr) {
  featuredBox.innerHTML = arr.map(featuredCard).join("");
}

function renderDeals(arr) {
  dealsBox.innerHTML = arr.map(productCard).join("");
}

// RUN SCRIPT
loadProducts();
