import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let allProducts = [];

function renderStars(rating) {
  const fullStar = '<i class="fa-solid fa-star"></i>';
  const halfStar = '<i class="fa-solid fa-star-half-stroke"></i>';
  const emptyStar = '<i class="fa-regular fa-star"></i>';
  let starsHTML = "";
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) starsHTML += fullStar;
  if (hasHalf) starsHTML += halfStar;
  for (let i = 0; i < 5 - fullStars - (hasHalf ? 1 : 0); i++) starsHTML += emptyStar;

  return starsHTML;
}

async function fetchDogAccessories() {
  const { data, error } = await supabase
    .from("product")
    .select("*")
    .ilike("category", "dog accessories");

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  allProducts = data;
  renderProducts(allProducts);
}

function renderProducts(products) {
  const container = document.querySelector(".js-products-grid");
  container.innerHTML = "";

  if (!products || products.length === 0) {
    container.innerHTML =
      `<p style="font-size:18px;text-align:center;width:100%;">No dog accessories found.</p>`;
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

function applyPriceFilter() {
  const minPrice = parseFloat(document.getElementById("price-min").value) || 0;
  const maxPrice = parseFloat(document.getElementById("price-max").value) || Infinity;

  const filtered = allProducts.filter(
    (p) => p.price / 100 >= minPrice && p.price / 100 <= maxPrice
  );

  renderProducts(filtered);
}

fetchDogAccessories();
document.getElementById("apply-filter").addEventListener("click", applyPriceFilter);
