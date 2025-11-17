// Toggle Search Bar
const searchIcon = document.querySelector(".search-icon i");
const searchBar = document.querySelector(".search-bar-container");

searchIcon.addEventListener("click", () => {
    searchBar.style.display =
        searchBar.style.display === "block" ? "none" : "block";
});

// Close when clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-icon")) {
        searchBar.style.display = "none";
    }
});

// =========================
// LIVE SEARCH FIXED VERSION
// =========================

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("keyup", () => {
    const filter = searchInput.value.toLowerCase();

    // Select ALL product types on the site
    const productCards = [
        ...document.querySelectorAll(".product-div"),
        ...document.querySelectorAll(".best-product-flexbox")
    ];

    productCards.forEach((card) => {
        const titleElement =
            card.querySelector(".product-text-title") ||
            card.querySelector(".best-product-text-title");

        if (!titleElement) return;

        const title = titleElement.textContent.toLowerCase();

        card.style.display = title.includes(filter) ? "flex" : "none";
    });
});
