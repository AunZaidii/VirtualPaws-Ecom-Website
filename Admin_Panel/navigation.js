// ---------------------------
// SIDEBAR NAVIGATION LOGIC
// ---------------------------

const dashboardSection = document.getElementById("dashboard-section");
const addProductSection = document.getElementById("add-product-section");
const addVetSection = document.getElementById("add-vet-section");
const addPetSection = document.getElementById("add-pet-section");
const addShelterSection = document.getElementById("add-shelter-section");   // NEW
const viewProductsSection = document.getElementById("view-products-section");
const viewVetsSection = document.getElementById("view-vets-section");
const viewPetsSection = document.getElementById("view-pets-section");
const viewSheltersSection = document.getElementById("view-shelters-section"); // NEW


function hideAllSections() {
    dashboardSection?.classList.add("hidden");
    addProductSection?.classList.add("hidden");
    addVetSection?.classList.add("hidden");
    addPetSection?.classList.add("hidden");
    addShelterSection?.classList.add("hidden");   // NEW
    viewProductsSection?.classList.add("hidden");
    viewVetsSection?.classList.add("hidden");
    viewPetsSection?.classList.add("hidden");
    viewSheltersSection?.classList.add("hidden"); // NEW
}

// ----- BUTTONS -----

document.querySelector("[data-target='dashboard']")?.addEventListener("click", () => {
    hideAllSections();
    dashboardSection.classList.remove("hidden");
});

document.querySelector("[data-target='add-product']")?.addEventListener("click", () => {
    hideAllSections();
    addProductSection.classList.remove("hidden");
});

document.querySelector("[data-target='add-vet']")?.addEventListener("click", () => {
    hideAllSections();
    addVetSection.classList.remove("hidden");
});

document.querySelector("[data-target='add-pet']")?.addEventListener("click", () => {
    hideAllSections();
    addPetSection.classList.remove("hidden");
});

document.querySelector("[data-target='view-products']")?.addEventListener("click", () => {
    hideAllSections();
    viewProductsSection.classList.remove("hidden");
});

document.querySelector("[data-target='view-vets']")?.addEventListener("click", () => {
    hideAllSections();
    viewVetsSection.classList.remove("hidden");
});

document.querySelector("[data-target='view-pets']")?.addEventListener("click", () => {
    hideAllSections();
    viewPetsSection.classList.remove("hidden");
});
document.querySelector("[data-target='add-shelter']")?.addEventListener("click", () => {
    hideAllSections();
    addShelterSection.classList.remove("hidden");
});

document.querySelector("[data-target='view-shelters']")?.addEventListener("click", () => {
    hideAllSections();
    viewSheltersSection.classList.remove("hidden");
});
