import { apiClient } from "../../utils/apiClient.js";

let allProducts = [];

// ⭐ Render star rating
function renderStars(rating) {
  const full = '<i class="fa-solid fa-star"></i>';
  const half = '<i class="fa-solid fa-star-half-stroke"></i>';
  const empty = '<i class="fa-regular fa-star"></i>';

  let output = "";
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) output += full;
  if (hasHalf) output += half;
  for (let i = 0; i < 5 - fullStars - (hasHalf ? 1 : 0); i++) output += empty;

  return output;
}

// 🧩 Fetch dog accessories
async function fetchDogAccessories() {
  try {
    const data = await apiClient.get("getProducts", { category: "dog accessories" });
    allProducts = data || [];
    renderProducts(allProducts);
  } catch (error) {
    console.error("Error fetching accessories:", error);
  }
}

// 🧩 Render products
function renderProducts(products) {
  const container = document.querySelector(".js-products-grid");
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML =
      `<p style="width:100%; text-align:center; font-size:18px;">No dog accessories found.</p>`;
    return;
  }

  products.forEach((p) => {
    const stars = renderStars(p.rating);
    const id = p.product_id;

    const card = `
      <div class="product-div" data-id="${id}">
        <div class="product-image-div">
          <img class="product-image" src="${p.image}" alt="${p.imageAlt}">
          <img class="product-image-hover" src="${p.hoverimage}" alt="${p.hoverimageAlt}">
        </div>
        <div class="product-text-div">
          <p class="product-text-title">${p.name}</p>
          <p class="product-text-rating">${stars}</p>
          <p class="product-text-price">
            <span style="color: rgb(135,218,72); font-weight:bold;">
              $${p.price}
            </span>
          </p>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", card);
  });

  // ⭐ Click → open product details
  document.querySelectorAll(".product-div").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      window.location.href = `../Products.html?id=${id}`;
    });
  });
}

// 💰 Price filter
function applyPriceFilter() {
  const min = parseFloat(document.getElementById("price-min").value) || 0;
  const max = parseFloat(document.getElementById("price-max").value) || Infinity;

  const filtered = allProducts.filter((p) => p.price >= min && p.price <= max);
  renderProducts(filtered);
}

// 🚀 Init
fetchDogAccessories();
document.getElementById("apply-filter").addEventListener("click", applyPriceFilter);

document.getElementById("reset-filter").addEventListener("click", () => {

  document.getElementById("price-min").value = "";
  document.getElementById("price-max").value = "";

  renderProducts(allProducts);
});