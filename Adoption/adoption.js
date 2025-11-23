// adoption.js  (use with: <script type="module" src="adoption.js"></script>)

import { apiClient } from "../utils/apiClient.js";

// ---------- State ----------
let currentFilters = {
  age: "",
  gender: "",
  location: "",
  vaccinated: false,
  category: "all",
  search: "",
};

let allPets = []; // filled from Supabase

// ---------- DOM Elements ----------
const petsGrid = document.getElementById("petsGrid");
const resultsCount = document.getElementById("resultsCount");

// Search inputs
const searchInput = document.getElementById("searchInput");
const mobileSearchInput = document.getElementById("mobileSearchInput");

// Mobile menu/filter
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileFilterBtn = document.getElementById("mobileFilterBtn");
const sidebar = document.getElementById("sidebar");
const closeFilters = document.getElementById("closeFilters");
const resetFilters = document.getElementById("resetFilters");

// Category chips
const categoryChips = document.querySelectorAll(".chip");

// Filter inputs
const ageFilter = document.getElementById("ageFilter");
const genderRadios = document.querySelectorAll('input[name="gender"]');
const locationFilter = document.getElementById("locationFilter");
const vaccinatedFilter = document.getElementById("vaccinatedFilter");

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", async () => {
  await loadPetsFromSupabase();
  renderPets();
  attachEventListeners();
});

// ---------- Load pets from API ----------
async function loadPetsFromSupabase() {
  try {
    const data = await apiClient.get("getPets");

    if (!data) {
      console.error("Error loading pets");
      petsGrid.innerHTML =
        '<p style="color:red; text-align:center;">Failed to load pets.</p>';
      return;
    }

    allPets = (data || []).map((row) => {
      const species =
        (row.species || "").toString().trim().toLowerCase() || "dog";

      return {
        id: row.pet_id,
        name: row.name || "Unnamed",
        species,
        gender: (row.gender || "").toString().trim().toLowerCase(),
        breed: row.breed || "",
        age: Number(row.age) || 0,
        location: row.location || "",
        vaccinations: row.vaccinations || "",
        tags: row.tags || "",
        image:
          row.image1 ||
          "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
      };
    });
  } catch (err) {
    console.error("Unexpected error loading pets:", err);
    petsGrid.innerHTML =
      '<p style="color:red; text-align:center;">Failed to load pets.</p>';
  }
}

// ---------- Event Listeners ----------
function attachEventListeners() {
  // Search (desktop)
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentFilters.search = e.target.value.toLowerCase();
      if (mobileSearchInput) mobileSearchInput.value = e.target.value;
      renderPets();
    });
  }

  // Search (mobile)
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener("input", (e) => {
      currentFilters.search = e.target.value.toLowerCase();
      if (searchInput) searchInput.value = e.target.value;
      renderPets();
    });
  }

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

  // Mobile filters
  if (mobileFilterBtn) {
    mobileFilterBtn.addEventListener("click", () => {
      sidebar.classList.add("mobile-active");
    });
  }

  if (closeFilters) {
    closeFilters.addEventListener("click", () => {
      sidebar.classList.remove("mobile-active");
    });
  }

  // Category chips
  categoryChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      categoryChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilters.category = chip.dataset.category; // all | dog | cat
      renderPets();
    });
  });

  // Age filter
  if (ageFilter) {
    ageFilter.addEventListener("change", (e) => {
      currentFilters.age = e.target.value;
      renderPets();
    });
  }

  // Gender filter
  genderRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      currentFilters.gender = e.target.value;
      renderPets();
    });
  });

  // Location
  if (locationFilter) {
    locationFilter.addEventListener("change", (e) => {
      currentFilters.location = e.target.value;
      renderPets();
    });
  }

  // Vaccinated
  if (vaccinatedFilter) {
    vaccinatedFilter.addEventListener("change", (e) => {
      currentFilters.vaccinated = e.target.checked;
      renderPets();
    });
  }

  // Reset filters
  if (resetFilters) {
    resetFilters.addEventListener("click", () => {
      currentFilters = {
        age: "",
        gender: "",
        location: "",
        vaccinated: false,
        category: currentFilters.category,
        search: currentFilters.search,
      };

      if (ageFilter) ageFilter.value = "";
      genderRadios.forEach((radio) => {
        radio.checked = radio.value === "";
      });
      if (locationFilter) locationFilter.value = "";
      if (vaccinatedFilter) vaccinatedFilter.checked = false;

      renderPets();
    });
  }
}

// ---------- Filtering ----------
function filterPets() {
  return allPets.filter((pet) => {
    // Search
    if (currentFilters.search) {
      const searchLower = currentFilters.search;
      const matchesSearch =
        pet.name.toLowerCase().includes(searchLower) ||
        pet.breed.toLowerCase().includes(searchLower) ||
        pet.species.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category (dog/cat/all)
    if (
      currentFilters.category !== "all" &&
      pet.species !== currentFilters.category
    ) {
      return false;
    }

    // Age ranges
    if (currentFilters.age) {
      const age = pet.age;
      if (currentFilters.age === "0-1" && age > 1) return false;
      if (currentFilters.age === "1-3" && (age < 1 || age > 3)) return false;
      if (currentFilters.age === "3-7" && (age < 3 || age > 7)) return false;
      if (currentFilters.age === "7+" && age < 7) return false;
    }

    // Gender
    if (currentFilters.gender && pet.gender !== currentFilters.gender) {
      return false;
    }

    // Location
    if (currentFilters.location && pet.location !== currentFilters.location) {
      return false;
    }

    // Vaccinated
    if (currentFilters.vaccinated) {
      const vaccStr = (pet.vaccinations || "").toLowerCase();
      if (!vaccStr.includes("vaccinated")) return false;
    }

    return true;
  });
}

// ---------- Rendering ----------
function renderPets() {
  const filteredPets = filterPets();

  resultsCount.textContent = `${filteredPets.length} ${
    filteredPets.length === 1 ? "pet" : "pets"
  } available`;

  petsGrid.innerHTML = "";

  if (filteredPets.length === 0) {
    petsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="emoji">🔍</div>
        <h3>No pets found</h3>
        <p>Try adjusting your filters or search query</p>
      </div>
    `;
    return;
  }

  filteredPets.forEach((pet) => {
    const card = createPetCard(pet);
    petsGrid.appendChild(card);
  });
}

// ---------- Pet Card ----------
function createPetCard(pet) {
  const card = document.createElement("div");
  card.className = "pet-card";
  card.onclick = () => {
    window.location.href = `pet-detail.html?id=${pet.id}`;
  };

  const vaccStr = (pet.vaccinations || "").toLowerCase();
  const isVaccinated = vaccStr.includes("vaccinated");

  const badges = [];
  if (isVaccinated) {
    badges.push(`
      <div class="badge-pill">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        Vaccinated
      </div>
    `);
  }

  const tagHtml = (pet.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  card.innerHTML = `
    <div class="pet-image-container">
      <img src="${pet.image}" alt="${pet.name}">
      <div class="pet-badges">${badges.join("")}</div>
    </div>
    <div class="pet-info">
      <div class="pet-header">
        <div>
          <div class="pet-name">${pet.name}</div>
          <div class="pet-breed">${pet.breed}</div>
        </div>
        <div class="age-badge">${pet.age} ${
    pet.age === 1 ? "year" : "years"
  }</div>
      </div>
      <div class="pet-meta">
        <span style="text-transform: capitalize;">${pet.gender}</span>
        <span>•</span>
        <div style="display: flex; align-items: center; gap: 0.25rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${pet.location}</span>
        </div>
      </div>
      <div class="pet-tags">${tagHtml}</div>
      <button class="btn btn-primary">View Details</button>
    </div>
  `;

  return card;
}
