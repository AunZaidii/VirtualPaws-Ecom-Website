import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ⭐ Function to generate star icons dynamically
function renderStars(rating) {
  const fullStar = '<i class="fa-solid fa-star"></i>';
  const halfStar = '<i class="fa-solid fa-star-half-stroke"></i>';
  const emptyStar = '<i class="fa-regular fa-star"></i>';

  let starsHTML = "";
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  // full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += fullStar;
  }

  // half star if needed
  if (hasHalf) starsHTML += halfStar;

  // remaining empty stars
  const remaining = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < remaining; i++) {
    starsHTML += emptyStar;
  }

  return starsHTML;
}

// 🦴 Fetch only "Dog Food" products from Supabase (case-insensitive)
async function fetchDogFood() {
  const { data, error } = await supabase
    .from("product")
    .select("*")
    .ilike("category", "dog food"); // 👈 case-insensitive match

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  renderProducts(data);
}

// 🧩 Render function
function renderProducts(products) {
  const container = document.querySelector(".js-products-grid");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = `<p style="font-size:18px;text-align:center;width:100%;">No dog food products found.</p>`;
    return;
  }

  products.forEach((product) => {
    const stars = renderStars(product.rating);
    const html = `
      <a href="${product.link}" class="product-link">
        <div class="product-div">
          <div class="product-image-div">
            <img class="product-image" src="${product.image}" alt="${product.imageAlt}">
            <img class="product-image-hover" src="${product.hoverimage}" alt="${product.hoverimageAlt}">
          </div>
          <div class="product-text-div">
            <p class="product-text-title">${product.name}</p>
            <p class="product-text-rating">${stars}</p>
            <p class="product-text-price">
              <span style="color: rgb(135, 218, 72); font-weight: bold;">
                $${(product.price / 100).toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </a>
    `;
    container.innerHTML += html;
  });
}

// 🚀 Run on load
fetchDogFood();
