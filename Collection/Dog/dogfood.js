import { apiClient } from "../../utils/apiClient.js";

let allProducts = [];

// ⭐ Render stars dynamically
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

// 🦴 Fetch dog food
async function fetchDogFood() {
  try {
    const data = await apiClient.get("getProducts", { category: "dog food" });
    allProducts = data || [];
    renderProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// 🧩 Render products
function renderProducts(products) {
  const container = document.querySelector(".js-products-grid");
  container.innerHTML = "";

  if (!products || products.length === 0) {
    container.innerHTML =
      `<p style="font-size:18px;text-align:center;width:100%;">No dog food products found.</p>`;
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

  // ⭐ Auto redirect to products page
  document.querySelectorAll(".product-div").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      if (id) {
        window.location.href = `../Products.html?id=${id}`;
      }
    });
  });
}

// 💰 Filter by price
function applyPriceFilter() {
  const minPrice = parseFloat(document.getElementById("price-min").value) || 0;
  const maxPrice = parseFloat(document.getElementById("price-max").value) || Infinity;

  const filtered = allProducts.filter(
    (p) => p.price >= minPrice && p.price <= maxPrice
  );

  renderProducts(filtered);
}

// 🚀 Initialize
fetchDogFood();
document.getElementById("apply-filter").addEventListener("click", applyPriceFilter);

document.getElementById("reset-filter").addEventListener("click", () => {

  document.getElementById("price-min").value = "";
  document.getElementById("price-max").value = "";

  renderProducts(allProducts);
});