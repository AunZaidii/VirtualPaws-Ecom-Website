// IMPORT API CLIENT
import { apiClient } from "../utils/apiClient.js";

// DOM TARGETS
const latestBox = document.getElementById("latestProducts");
const featuredBox = document.getElementById("featuredProducts");
const dealsBox = document.getElementById("dealsProducts");

// LOAD PRODUCTS
async function loadProducts() {
  try {
    const products = await apiClient.get("getProducts");

    if (!products?.length) {
      console.warn("No products found");
      return;
    }

    const shuffled = [...products].sort(() => 0.5 - Math.random());

    renderLatest(shuffled.slice(0, 5));
    renderFeatured(shuffled.slice(5, 9));
    renderDeals(shuffled.slice(9, 14));
  } catch (error) {
    console.error("ERROR LOADING PRODUCTS:", error);
  }
}

// PRODUCT CARDS
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
          <p class="product-text-price"><span class="green-price">Rs ${p.price}</span></p>
        </div>
      </div>
    </a>`;
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
          <p class="best-product-text-price"><span class="green-price">Rs ${p.price}</span></p>
          <p class="best-product-addtocart">Add To Cart</p>
        </div>
      </div>
    </a>`;
}

// STAR RENDERER
function renderStars(rating = 0) {
  let html = "";
  for (let i = 0; i < Math.floor(rating); i++)
    html += `<i class="fa-solid fa-star"></i>`;
  if (rating % 1 !== 0)
    html += `<i class="fa-solid fa-star-half-stroke"></i>`;
  return html;
}

// RENDER SECTIONS
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
