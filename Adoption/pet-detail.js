// ============================
// Pet Detail - Product style
// ============================

// Get pet ID from localStorage
const petId = localStorage.getItem('selectedPet');
let currentPet = null;

// Gallery / info
const mainImage = document.getElementById('mainImage');
const thumbnailGrid = document.getElementById('thumbnailGrid');
const petInfo = document.getElementById('petInfo');
const infoSection = document.querySelector('.info-section');

// Modals & actions
const contactModal     = document.getElementById('contactModal');
const modalTitle       = document.getElementById('modalTitle');
const modalShelterInfo = document.getElementById('modalShelterInfo');
const closeModal       = document.getElementById('closeModal');
const cancelBtn        = document.getElementById('cancelBtn');
const contactForm      = document.getElementById('contactForm');

const successModal     = document.getElementById('successModal');
const successMessage   = document.getElementById('successMessage');

// Optional mobile menu (guarded)
const mobileMenuBtn = document.getElementById('mobileMenuBtn') || document.querySelector('.mobile-menu-btn');
const mobileMenu    = document.getElementById('mobileMenu')    || document.querySelector('.mobile-nav');

// Debounce helper
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// In product-like layout we do NOT force equal heights.
// Keep this as a no-op to avoid inner scrollbars.
function syncInfoHeight() {
  if (!infoSection) return;
  infoSection.style.height = 'auto';
  infoSection.style.overflow = 'visible';
}

// Sync once after image load (kept for safety)
if (mainImage) {
  mainImage.addEventListener('load', () => {
    setTimeout(syncInfoHeight, 20);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (!petId) {
    window.location.href = 'index.html';
    return;
  }

  // Accept id as string or number
  currentPet = (window.pets || []).find(p => String(p.id) === String(petId));
  if (!currentPet) {
    console.warn('Pet not found for id:', petId);
    window.location.href = 'index.html';
    return;
  }

  renderPetDetail();
  attachEventListeners();

  // Scroll to top when opening a pet
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// -------------------------
// Render top detail section
// -------------------------
function renderPetDetail() {
  // Main image
  if (currentPet.images?.length) {
    mainImage.src = currentPet.images[0];
    mainImage.alt = currentPet.name;
  }

  // Thumbnails
  thumbnailGrid.innerHTML = '';
  (currentPet.images || []).forEach((image, index) => {
    const thumb = document.createElement('div');
    thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
    thumb.innerHTML = `<img src="${image}" alt="${currentPet.name} - ${index + 1}">`;
    thumb.addEventListener('click', () => selectImage(index));
    thumbnailGrid.appendChild(thumb);
  });

  // Limit temperament tags (keeps panel compact)
  const maxTraits = 8;
  const traits = (currentPet.temperament || []).slice(0, maxTraits);

  // Info panel
  petInfo.innerHTML = `
    <div class="pet-detail-header">
      <div class="pet-detail-title">
        <h1>${currentPet.name}</h1>
        <h3>${currentPet.breed || ''}</h3>
      </div>
      <div class="action-btns">
        <button class="action-btn" id="saveBtn" aria-label="Save">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button class="action-btn" aria-label="Share">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6"  cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49"></line>
          </svg>
        </button>
      </div>
    </div>

    <div class="quick-info-grid">
      <div class="info-card">
        <label>Age</label>
        <div class="value">${currentPet.age} ${Number(currentPet.age) === 1 ? 'year' : 'years'}</div>
      </div>
      <div class="info-card">
        <label>Gender</label>
        <div class="value">${currentPet.gender || '—'}</div>
      </div>
      <div class="info-card">
        <label>Size</label>
        <div class="value">${currentPet.size || '—'}</div>
      </div>
      <div class="info-card">
        <label>Color</label>
        <div class="value">${currentPet.color || '—'}</div>
      </div>
    </div>

    <div class="health-badges">
      ${currentPet.vaccinated   ? `<div class="health-badge">Vaccinated</div>`       : ''}
      ${currentPet.microchipped ? `<div class="health-badge">Microchipped</div>`     : ''}
      ${currentPet.spayedNeutered ? `<div class="health-badge">Spayed/Neutered</div>`: ''}
    </div>

    <div class="temperament-section">
      <h4>Temperament</h4>
      <div class="temperament-tags">
        ${traits.map(trait => `<span class="temperament-tag">${trait}</span>`).join('')}
      </div>
    </div>

    <div class="location-info">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      <span>${currentPet.location || '—'}</span>
    </div>

    <div class="cta-buttons">
      <button class="btn btn-primary" id="adoptBtn">Adopt ${currentPet.name}</button>
      <button class="btn btn-outline-primary" id="contactBtn">Contact Shelter</button>
    </div>
  `;

  // Render the card grid below (as separate cards, no wrapper)
  renderCentralDetails();

  // Button handlers
  const adoptBtn = document.getElementById('adoptBtn');
  const contactBtn = document.getElementById('contactBtn');
  const saveBtn = document.getElementById('saveBtn');

  adoptBtn && adoptBtn.addEventListener('click', openContactModal);
  contactBtn && contactBtn.addEventListener('click', openContactModal);
  saveBtn && saveBtn.addEventListener('click', toggleSave);

  // Final tidy
  setTimeout(syncInfoHeight, 30);
}

// Swap image
function selectImage(index) {
  if (!currentPet?.images?.[index]) return;
  mainImage.src = currentPet.images[index];

  // Update active thumbnail
  const thumbs = thumbnailGrid.querySelectorAll('.thumbnail');
  thumbs.forEach((el, i) => el.classList.toggle('active', i === index));
}

// Save toggle
function toggleSave() {
  const btn = document.getElementById('saveBtn');
  if (btn) btn.classList.toggle('saved');
}

// Open contact modal
function openContactModal() {
  if (!contactModal) return;

  if (modalTitle) modalTitle.textContent = `Contact About ${currentPet.name}`;

  if (modalShelterInfo) {
    modalShelterInfo.innerHTML = `
      <div class="shelter-header">
        ${currentPet.shelter?.verified ? `
          <div class="verified-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>` : ''
        }
        <div>
          <h4>${currentPet.shelter?.name || 'Shelter'}</h4>
          ${currentPet.shelter?.verified ? '<div class="verified">Verified Shelter</div>' : ''}
        </div>
      </div>
      <div class="contact-list" style="margin-top:1rem;">
        <div class="contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <a href="tel:${currentPet.shelter?.phone || ''}">${currentPet.shelter?.phone || ''}</a>
        </div>
        <div class="contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <a href="mailto:${currentPet.shelter?.email || ''}">${currentPet.shelter?.email || ''}</a>
        </div>
        <div class="contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${currentPet.shelter?.address || ''}</span>
        </div>
      </div>
    `;
  }

  contactModal.classList.add('active');
}

// Close modal
function closeContactModal() {
  if (!contactModal) return;
  contactModal.classList.remove('active');
  contactForm && contactForm.reset();
}

// Submit form
function submitForm(e) {
  e.preventDefault();
  closeContactModal();

  if (successMessage) {
    successMessage.textContent = `The shelter will contact you soon regarding ${currentPet.name}.`;
  }
  successModal && successModal.classList.add('active');

  setTimeout(() => {
    successModal && successModal.classList.remove('active');
  }, 2500);
}

// -------------------------------------------
// Render the grid of cards below the main row
// -------------------------------------------
function renderCentralDetails() {
  const container = document.getElementById('centralDetails');
  if (!container) return;

  const aboutHTML = `
    <div class="detail-card about">
      <h3>About ${currentPet.name}</h3>
      <p>${currentPet.description || ''}</p>
    </div>`;

  const healthHTML = `
    <div class="health-card">
      <h3>Health & History</h3>
      <div class="health-table">
        <div class="health-row">
          <span class="label">Last Vet Visit</span>
          <span class="value">${currentPet.healthHistory?.lastVetVisit || '—'}</span>
        </div>
        <div class="health-row">
          <span class="label">Diet</span>
          <span class="value">${currentPet.healthHistory?.diet || '—'}</span>
        </div>
        <div class="health-row">
          <span class="label">Vaccinations</span>
          <span class="value">${currentPet.healthHistory?.vaccinations || '—'}</span>
        </div>
      </div>
    </div>`;

  const adoptionHTML = `
    <div class="adoption-card">
      <h3>Adoption Details</h3>
      <div class="adoption-fee">
        <label>Fee</label>
        <div class="price">PKR ${Number(currentPet.adoptionFee || 0).toLocaleString()}</div>
      </div>
      <label style="display:block; color:#666; margin-top:0.75rem;">Requirements</label>
      <ul class="requirements-list">
        ${(currentPet.requirements || []).map(req => `<li>${req}</li>`).join('')}
      </ul>
    </div>`;

  const shelterHTML = `
    <div class="shelter-card">
      <h3>${currentPet.shelter?.name || 'Shelter'}${currentPet.shelter?.verified ? ' ✓' : ''}</h3>
      <div class="contact-list">
        <div class="contact-item"><i class="fas fa-phone"></i> <a href="tel:${currentPet.shelter?.phone || ''}">${currentPet.shelter?.phone || ''}</a></div>
        <div class="contact-item"><i class="fas fa-envelope"></i> <a href="mailto:${currentPet.shelter?.email || ''}">${currentPet.shelter?.email || ''}</a></div>
        <div class="contact-item"><i class="fas fa-map-marker-alt"></i> <span>${currentPet.shelter?.address || ''}</span></div>
      </div>
    </div>`;

  const encourageHTML = `
    <div class="encouragement-card">
      <div>
        <p style="font-weight:700; margin:0;">Give ${currentPet.name} a loving home ❤️</p>
        <p class="note" style="margin:6px 0 0;">Every adoption saves a life and makes room for another animal in need.</p>
      </div>
    </div>`;

  // ✅ IMPORTANT: render cards as direct children (NO wrapper div)
  container.innerHTML = `${aboutHTML}${healthHTML}${adoptionHTML}${shelterHTML}${encourageHTML}`;
}

// --------------------
// Event registrations
// --------------------
function attachEventListeners() {
  // Modal buttons
  closeModal && closeModal.addEventListener('click', closeContactModal);
  cancelBtn  && cancelBtn.addEventListener('click', closeContactModal);
  contactForm && contactForm.addEventListener('submit', submitForm);

  // Close modal by clicking backdrop
  contactModal && contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) closeContactModal();
  });

  // Optional mobile menu
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

  // Keep info height natural (noop but preserved)
  window.addEventListener('resize', debounce(syncInfoHeight, 120));
}
