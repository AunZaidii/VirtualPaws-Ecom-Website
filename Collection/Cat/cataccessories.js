import { apiClient } from "../../utils/apiClient.js";

let allProducts = [];

// ⭐ Stars Renderer
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

// 🐱 Fetch cat accessories
async function fetchCatAccessories() {
  try {
    const data = await apiClient.get("getProducts", { category: "cat accessories" });
    allProducts = data || [];
    renderProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// ⭐ Render products
function renderProducts(products) {
  const container = document.querySelector(".js-products-grid");
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML = `<p style="text-align:center;width:100%;">No cat accessories found.</p>`;
    return;
  }

  products.forEach((product) => {
    const stars = renderStars(product.rating);
    const id = product.product_id;

    const html = `
      <div class="product-div" data-id="${id}">
        <div class="product-image-div">
          <img class="product-image" src="${product.image}" alt="${product.imageAlt}">
          <img class="product-image-hover" src="${product.hoverimage}" alt="${product.hoverimageAlt}">
        </div>
        <div class="product-text-div">
          <p class="product-text-title">${product.name}</p>
          <p class="product-text-rating">${stars}</p>
          <p class="product-text-price">
            <span style="color: rgb(135,218,72); font-weight:bold;">
              $${product.price}
            </span>
          </p>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", html);
  });

  // ⭐ Click: Go to Product Details
  document.querySelectorAll(".product-div").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      window.location.href = `../Products.html?id=${id}&ref=cataccessories`;
    });
  });
}

// 💰 Price Filter
function applyPriceFilter() {
  const min = parseFloat(document.getElementById("price-min").value) || 0;
  const max = parseFloat(document.getElementById("price-max").value) || Infinity;

  const filtered = allProducts.filter((p) => p.price >= min && p.price <= max);
  renderProducts(filtered);
}

fetchCatAccessories();
document.getElementById("apply-filter").addEventListener("click", applyPriceFilter);

document.getElementById("reset-filter").addEventListener("click", () => {

  document.getElementById("price-min").value = "";
  document.getElementById("price-max").value = "";

  renderProducts(allProducts);
});