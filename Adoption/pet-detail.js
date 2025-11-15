// ===========================================================
//    FINAL WORKING VERSION — pet-detail.js
// ===========================================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ---------- Supabase setup ----------
const supabase = createClient(
  "https://oekreylufrqvuzgoyxye.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8"
);

// ---------- Get pet ID ----------
const petId = localStorage.getItem("selectedPet");
let currentPet = null;

// ---------- DOM ----------
const mainImage = document.getElementById("mainImage");
const thumbnailGrid = document.getElementById("thumbnailGrid");
const petInfo = document.getElementById("petInfo");

const contactModal = document.getElementById("contactModal");
const contactForm = document.getElementById("contactForm");
const modalTitle = document.getElementById("modalTitle");
const modalShelterInfo = document.getElementById("modalShelterInfo");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

const successModal = document.getElementById("successModal");
const successMessage = document.getElementById("successMessage");

// ============================================================
//    LOAD PET + SHELTER DATA
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  if (!petId) {
    window.location.href = "adoption.html";
    return;
  }

  await loadPet();
  renderPet();
});

// ------------------------------------------------------------
// Load pet + shelter
// ------------------------------------------------------------
async function loadPet() {
  const { data: petRow } = await supabase
    .from("pet")
    .select(
      `
      pet_id,
      name, species, gender, breed, age, size, color,
      location, description, temperament, tags,
      last_vet_visit, diet, vaccinations, fee,
      adoption_required, health_status,
      image1, image2, image3,
      shelter_id, shelter_name
    `
    )
    .eq("pet_id", petId)
    .single();

  if (!petRow) return;

  // LOAD SHELTER DETAILS FROM FOREIGN KEY
  let shelterRow = null;

  if (petRow.shelter_id) {
    const { data } = await supabase
      .from("shelter")
      .select("shelter_name, phone, email, address, verified")
      .eq("shelter_id", petRow.shelter_id)
      .single();
    shelterRow = data;
  }

  currentPet = mapPet(petRow, shelterRow);
}

// ------------------------------------------------------------
// Map DB → usable object
// ------------------------------------------------------------
function mapPet(row, shelterRow) {
  const images = [row.image1, row.image2, row.image3].filter(Boolean);

  return {
    id: row.pet_id,
    name: row.name,
    breed: row.breed,
    age: row.age,
    gender: row.gender,
    size: row.size,
    color: row.color,
    location: row.location,
    description: row.description,
    fee: row.fee || 0,
    tags: (row.tags || "").split(",").map((t) => t.trim()),

    temperament: (row.temperament || "").split(",").map((t) => t.trim()),

    images: images.length ? images : [
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
    ],

    requirements: (row.adoption_required || "").split(",").map((t) => t.trim()),

    healthHistory: {
      lastVetVisit: row.last_vet_visit || "Not provided",
      diet: row.diet || "Not provided",
      vaccinations: row.vaccinations || "Not provided",
      health: row.health_status || "Unknown"
    },

    shelter: {
      name: shelterRow?.shelter_name || row.shelter_name || "Animal Shelter",
      phone: shelterRow?.phone || "",
      email: shelterRow?.email || "",
      address: shelterRow?.address || "",
      verified: shelterRow?.verified || false,
    }
  };
}

// ============================================================
//    RENDER UI
// ============================================================

function renderPet() {
  if (!currentPet) return;

  // Main Image
  mainImage.src = currentPet.images[0];

  // Thumbnails
  thumbnailGrid.innerHTML = "";
  currentPet.images.forEach((src, i) => {
    const div = document.createElement("div");
    div.className = "thumbnail" + (i === 0 ? " active" : "");
    div.innerHTML = `<img src="${src}">`;
    div.onclick = () => {
      mainImage.src = src;
      document.querySelectorAll(".thumbnail").forEach(t => t.classList.remove("active"));
      div.classList.add("active");
    };
    thumbnailGrid.appendChild(div);
  });

  // Info card right side
  petInfo.innerHTML = `
    <div class="pet-detail-header">
      <div class="pet-detail-title">
        <h1>${currentPet.name}</h1>
        <h3>${currentPet.breed}</h3>
      </div>
      <div class="action-btns"></div>
    </div>

    <div class="quick-info-grid">
      <div class="info-card"><label>Age</label><div class="value">${currentPet.age} years</div></div>
      <div class="info-card"><label>Gender</label><div class="value">${currentPet.gender}</div></div>
      <div class="info-card"><label>Size</label><div class="value">${currentPet.size}</div></div>
      <div class="info-card"><label>Color</label><div class="value">${currentPet.color}</div></div>
    </div>

    <div class="health-badges">
      ${currentPet.tags.map(t => `<span class="health-badge">${t}</span>`).join("")}
    </div>

    <div class="temperament-section">
      <h4>Temperament</h4>
      <div class="temperament-tags">
        ${currentPet.temperament.map(t => `<span class="temperament-tag">${t}</span>`).join("")}
      </div>
    </div>

    <div class="location-info">
      <i class="fa-solid fa-location-dot"></i> ${currentPet.location}
    </div>

    <div class="cta-buttons">
      <button class="btn btn-primary" id="adoptBtn">Adopt ${currentPet.name}</button>
      <button class="btn btn-outline-primary" id="contactBtn">Contact Shelter</button>
    </div>
  `;

  renderCentralDetails();

  // CLICK EVENTS
  document.getElementById("contactBtn").onclick = handleContactShelter;
  document.getElementById("adoptBtn").onclick = openContactModal;
}

// ============================================================
//    CENTRAL DETAILS SECTION
// ============================================================

function renderCentralDetails() {
  const c = document.getElementById("centralDetails");

  c.innerHTML = `
    <div class="detail-card about">
      <h3>About ${currentPet.name}</h3>
      <p>${currentPet.description}</p>
    </div>

    <div class="health-card">
      <h3>Health & History</h3>
      <div class="health-row"><span class="label">Overall Health</span><span class="value">${currentPet.healthHistory.health}</span></div>
      <div class="health-row"><span class="label">Last Vet Visit</span><span class="value">${currentPet.healthHistory.lastVetVisit}</span></div>
      <div class="health-row"><span class="label">Diet</span><span class="value">${currentPet.healthHistory.diet}</span></div>
      <div class="health-row"><span class="label">Vaccinations</span><span class="value">${currentPet.healthHistory.vaccinations}</span></div>
    </div>

    <div class="adoption-card">
      <h3>Adoption Details</h3>
      <div class="adoption-fee">
        <label>Fee</label>
        <div class="price">PKR ${currentPet.fee.toLocaleString()}</div>
      </div>
      <label>Requirements</label>
      <ul class="requirements-list">
        ${currentPet.requirements.map(r => `<li>${r}</li>`).join("")}
      </ul>
    </div>

    <div class="shelter-card">
      <h3>${currentPet.shelter.name}</h3>
      <div class="contact-list">

        ${currentPet.shelter.phone ? `
          <div class="contact-item"><i class="fa-solid fa-phone"></i> ${currentPet.shelter.phone}</div>` : ""}

        ${currentPet.shelter.email ? `
          <div class="contact-item"><i class="fa-solid fa-envelope"></i> ${currentPet.shelter.email}</div>` : ""}

        ${currentPet.shelter.address ? `
          <div class="contact-item"><i class="fa-solid fa-map-marker-alt"></i> ${currentPet.shelter.address}</div>` : ""}

      </div>
    </div>
  `;
}

// ============================================================
//    CONTACT SHELTER BUTTON (opens phone dialer)
// ============================================================

function handleContactShelter() {
  if (!currentPet?.shelter?.phone) {
    alert("Shelter phone number is not available.");
    return;
  }

  // OPEN PHONE DIALER
  window.location.href = `tel:${currentPet.shelter.phone}`;
}

// ============================================================
//    CONTACT MODAL (Adoption Request)
// ============================================================

function openContactModal() {
  modalTitle.textContent = `Contact About ${currentPet.name}`;
  contactModal.classList.add("active");
}

closeModal.onclick = () => contactModal.classList.remove("active");
cancelBtn.onclick = () => contactModal.classList.remove("active");

contactForm.onsubmit = (e) => {
  e.preventDefault();
  contactModal.classList.remove("active");

  successMessage.textContent = `The shelter will contact you soon regarding ${currentPet.name}.`;
  successModal.classList.add("active");

  setTimeout(() => successModal.classList.remove("active"), 2500);
};
