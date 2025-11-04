// State
let currentFilters = {
  species: [],
  age: '',
  gender: '',
  location: '',
  vaccinated: false,
  category: 'all',
  search: ''
};

// DOM Elements
const petsGrid = document.getElementById('petsGrid');
const resultsCount = document.getElementById('resultsCount');
const searchInput = document.getElementById('searchInput');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileFilterBtn = document.getElementById('mobileFilterBtn');
const sidebar = document.getElementById('sidebar');
const closeFilters = document.getElementById('closeFilters');
const resetFilters = document.getElementById('resetFilters');

// Category chips
const categoryChips = document.querySelectorAll('.chip');

// Filter inputs
const speciesCheckboxes = document.querySelectorAll('input[name="species"]');
const ageFilter = document.getElementById('ageFilter');
const genderRadios = document.querySelectorAll('input[name="gender"]');
const locationFilter = document.getElementById('locationFilter');
const vaccinatedFilter = document.getElementById('vaccinatedFilter');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderPets();
  attachEventListeners();
});

// Event Listeners
function attachEventListeners() {
  // Search
  searchInput.addEventListener('input', (e) => {
    currentFilters.search = e.target.value.toLowerCase();
    mobileSearchInput.value = e.target.value;
    renderPets();
  });

  mobileSearchInput.addEventListener('input', (e) => {
    currentFilters.search = e.target.value.toLowerCase();
    searchInput.value = e.target.value;
    renderPets();
  });

  // Mobile menu
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  // Mobile filters
  mobileFilterBtn.addEventListener('click', () => {
    sidebar.classList.add('mobile-active');
  });

  closeFilters.addEventListener('click', () => {
    sidebar.classList.remove('mobile-active');
  });

  // Category chips
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilters.category = chip.dataset.category;
      renderPets();
    });
  });

  // Species checkboxes
  speciesCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      currentFilters.species = Array.from(speciesCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
      renderPets();
    });
  });

  // Age filter
  ageFilter.addEventListener('change', (e) => {
    currentFilters.age = e.target.value;
    renderPets();
  });

  // Gender filter
  genderRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFilters.gender = e.target.value;
      renderPets();
    });
  });

  // Location filter
  locationFilter.addEventListener('change', (e) => {
    currentFilters.location = e.target.value;
    renderPets();
  });

  // Vaccinated filter
  vaccinatedFilter.addEventListener('change', (e) => {
    currentFilters.vaccinated = e.target.checked;
    renderPets();
  });

  // Reset filters
  resetFilters.addEventListener('click', () => {
    currentFilters = {
      species: [],
      age: '',
      gender: '',
      location: '',
      vaccinated: false,
      category: currentFilters.category,
      search: currentFilters.search
    };

    // Reset form inputs
    speciesCheckboxes.forEach(cb => cb.checked = false);
    ageFilter.value = '';
    genderRadios.forEach(radio => {
      radio.checked = radio.value === '';
    });
    locationFilter.value = '';
    vaccinatedFilter.checked = false;

    renderPets();
  });
}

// Filter pets
function filterPets() {
  return pets.filter(pet => {
    // Search
    if (currentFilters.search) {
      const searchLower = currentFilters.search;
      const matchesSearch = 
        pet.name.toLowerCase().includes(searchLower) ||
        pet.breed.toLowerCase().includes(searchLower) ||
        pet.species.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category
    if (currentFilters.category !== 'all' && pet.species !== currentFilters.category) {
      return false;
    }

    // Species
    if (currentFilters.species.length > 0 && !currentFilters.species.includes(pet.species)) {
      return false;
    }

    // Age
    if (currentFilters.age) {
      const age = pet.age;
      if (currentFilters.age === '0-1' && age > 1) return false;
      if (currentFilters.age === '1-3' && (age < 1 || age > 3)) return false;
      if (currentFilters.age === '3-7' && (age < 3 || age > 7)) return false;
      if (currentFilters.age === '7+' && age < 7) return false;
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
    if (currentFilters.vaccinated && !pet.vaccinated) {
      return false;
    }

    return true;
  });
}

// Render pets
function renderPets() {
  const filteredPets = filterPets();
  
  // Update count
  resultsCount.textContent = `${filteredPets.length} ${filteredPets.length === 1 ? 'pet' : 'pets'} available`;

  // Clear grid
  petsGrid.innerHTML = '';

  // Show empty state or render pets
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

  // Render pet cards
  filteredPets.forEach(pet => {
    const card = createPetCard(pet);
    petsGrid.appendChild(card);
  });
}

// Create pet card
function createPetCard(pet) {
  const card = document.createElement('div');
  card.className = 'pet-card';
  card.onclick = () => {
    localStorage.setItem('selectedPet', pet.id);
    window.location.href = 'pet-detail.html';
  };

  const badges = [];
  if (pet.vaccinated) {
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

  const tags = [];
  if (pet.microchipped) {
    tags.push('<span class="tag">Microchipped</span>');
  }
  if (pet.spayedNeutered) {
    tags.push('<span class="tag">Spayed/Neutered</span>');
  }

  card.innerHTML = `
    <div class="pet-image-container">
      <img src="${pet.image}" alt="${pet.name}">
      <div class="pet-badges">
        ${badges.join('')}
      </div>
    </div>
    <div class="pet-info">
      <div class="pet-header">
        <div>
          <div class="pet-name">${pet.name}</div>
          <div class="pet-breed">${pet.breed}</div>
        </div>
        <div class="age-badge">${pet.age} ${pet.age === 1 ? 'year' : 'years'}</div>
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
      <div class="pet-tags">
        ${tags.join('')}
      </div>
      <button class="btn btn-primary">View Details</button>
    </div>
  `;

  return card;
}
