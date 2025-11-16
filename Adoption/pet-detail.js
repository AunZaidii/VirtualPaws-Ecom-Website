// pet-detail.js  (use with: <script type="module" src="pet-detail.js"></script>)

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ---------- Supabase setup ----------
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------- ID from localStorage ----------
// ---------- Get ID from URL first, then fallback to localStorage ----------
const urlParams = new URLSearchParams(window.location.search);
let petId = urlParams.get("id");

if (!petId) {
  petId = localStorage.getItem("selectedPet");
}

let currentPet = null;


// ---------- DOM ----------
const mainImage = document.getElementById("mainImage");
const thumbnailGrid = document.getElementById("thumbnailGrid");
const petInfo = document.getElementById("petInfo");
const infoSection = document.querySelector(".info-section");

const contactModal = document.getElementById("contactModal");
const contactForm = document.getElementById("contactForm");
const modalTitle = document.getElementById("modalTitle");
const modalShelterInfo = document.getElementById("modalShelterInfo");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const successModal = document.getElementById("successModal");
const successMessage = document.getElementById("successMessage");

// ---------- Utilities ----------
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function syncInfoHeight() {
  if (!infoSection || !mainImage) return;

  if (window.matchMedia("(max-width: 768px)").matches) {
    infoSection.style.height = "auto";
    infoSection.style.overflow = "visible";
    return;
  }

  const imgHeight = mainImage.getBoundingClientRect().height;
  if (imgHeight && imgHeight > 0) {
    infoSection.style.height = `${Math.round(imgHeight)}px`;
    infoSection.style.overflow = "auto";
  }
}

if (mainImage) {
  mainImage.addEventListener("load", () => {
    setTimeout(syncInfoHeight, 20);
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", async () => {
  if (!petId) {
    window.location.href = "adoption.html";
    return;
  }

  await loadPetFromSupabase();
  if (!currentPet) {
    window.location.href = "adoption.html";
    return;
  }

  renderPetDetail();
  attachEventListeners();
});

// ---------- Load one pet (+ shelter) from Supabase ----------
async function loadPetFromSupabase() {
  try {
    const { data: petRow, error: petError } = await supabase
      .from("pet")
      .select(
        `
        pet_id,
        name,
        species,
        gender,
        breed,
        age,
        size,
        color,
        location,
        description,
        temperament,
        health_status,
        tags,
        last_vet_visit,
        diet,
        vaccinations,
        fee,
        adoption_required,
        shelter_id,
        shelter_name,
        image1,
        image2,
        image3
      `
      )
      .eq("pet_id", petId)
      .single();

    if (petError) {
      console.error("Error loading pet:", petError);
      return;
    }

    let shelterRow = null;
    if (petRow.shelter_id) {
      const { data: sRow, error: sError } = await supabase
        .from("shelter")
        .select("shelter_id, shelter_name, address, phone, email, verified")
        .eq("shelter_id", petRow.shelter_id)
        .single();

      if (sError) {
        console.warn("Error loading shelter (using fallback):", sError);
      } else {
        shelterRow = sRow;
      }
    }

    currentPet = mapPetRow(petRow, shelterRow);
  } catch (err) {
    console.error("Unexpected error loading pet:", err);
  }
}

// Map DB row → object used by UI
function mapPetRow(row, shelterRow) {
  const images = [row.image1, row.image2, row.image3].filter(
    (src) => src && src.trim() !== ""
  );
  if (images.length === 0) {
    images.push(
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
    );
  }

  const temperamentArr = (row.temperament || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const tagsArr = (row.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const requirementsArr = (row.adoption_required || "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  const healthHistory = {
    lastVetVisit: row.last_vet_visit
      ? new Date(row.last_vet_visit).toLocaleDateString()
      : "Not specified",
    diet: row.diet || "Not specified",
    vaccinations: row.vaccinations || "Not specified",
  };

  const shelter = {
    id: shelterRow?.shelter_id || row.shelter_id || null,
    name:
      (shelterRow && shelterRow.shelter_name) ||
      row.shelter_name ||
      "Animal Shelter",
    verified: shelterRow?.verified || false,
    phone: shelterRow?.phone || "",
    email: shelterRow?.email || "",
    address: shelterRow?.address || "",
  };

  return {
    id: row.pet_id,
    name: row.name,
    species: row.species,
    gender: row.gender,
    breed: row.breed,
    age: row.age,
    size: row.size,
    color: row.color,
    location: row.location,
    description: row.description,
    fee: row.fee,
    healthStatus: row.health_status || "",
    vaccinations: row.vaccinations || "",
    tags: tagsArr,
    images,
    temperament: temperamentArr,
    healthHistory,
    requirements: requirementsArr,
    shelter,
  };
}

// ---------- Render pet detail ----------
function renderPetDetail() {
  if (!currentPet) return;

  // Main image
  if (currentPet.images?.length) {
    mainImage.src = currentPet.images[0];
    mainImage.alt = currentPet.name;
  }

  // Thumbnails
  thumbnailGrid.innerHTML = "";
  currentPet.images.forEach((image, index) => {
    const thumbnail = document.createElement("div");
    thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`;
    thumbnail.innerHTML = `<img src="${image}" alt="${currentPet.name}">`;
    thumbnail.onclick = () => selectImage(index);
    thumbnailGrid.appendChild(thumbnail);
  });

  const isVaccinated = currentPet.vaccinations
    .toLowerCase()
    .includes("vaccinated");

  const healthBadges =
    (isVaccinated
      ? `<div class="health-badge">Vaccinated</div>`
      : "") +
    currentPet.tags
      .map((t) => `<div class="health-badge">${t}</div>`)
      .join("");

  // Info card (right) — HEART REMOVED
  petInfo.innerHTML = `
    <div class="pet-detail-header">
      <div class="pet-detail-title">
        <h1>${currentPet.name}</h1>
        <h3>${currentPet.breed}</h3>
      </div>
      <div class="action-btns">
        <button class="action-btn" aria-label="Share">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
      </div>
    </div>

    <div class="quick-info-grid">
      <div class="info-card">
        <label>Age</label>
        <div class="value">${currentPet.age} ${
    currentPet.age === 1 ? "year" : "years"
  }</div>
      </div>
      <div class="info-card">
        <label>Gender</label>
        <div class="value" style="text-transform:capitalize">${
          currentPet.gender
        }</div>
      </div>
      <div class="info-card">
        <label>Size</label>
        <div class="value">${currentPet.size || "-"}</div>
      </div>
      <div class="info-card">
        <label>Color</label>
        <div class="value">${currentPet.color || "-"}</div>
      </div>
    </div>

    <div class="health-badges">
      ${healthBadges}
    </div>

    <div class="temperament-section">
      <h4>Temperament</h4>
      <div class="temperament-tags">
        ${currentPet.temperament
          .map((trait) => `<span class="temperament-tag">${trait}</span>`)
          .join("")}
      </div>
    </div>

    <div class="location-info">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      <span>${currentPet.location}</span>
    </div>

    <div class="cta-buttons">
      <button class="btn btn-primary" id="adoptBtn">Adopt ${
        currentPet.name
      }</button>
      <button class="btn btn-outline-primary" id="contactBtn">Contact Shelter</button>
    </div>
  `;

  renderCentralDetails();

  // Buttons: adopt opens modal, contact dials phone
  document
    .getElementById("adoptBtn")
    .addEventListener("click", openAdoptionModal);
  document
    .getElementById("contactBtn")
    .addEventListener("click", directCallShelter);

  setTimeout(syncInfoHeight, 30);
}

// ---------- Thumbnails ----------
function selectImage(index) {
  mainImage.src = currentPet.images[index];

  const thumbnails = document.querySelectorAll(".thumbnail");
  thumbnails.forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });
}

// ---------- Direct phone call ----------
function directCallShelter() {
  const phone = currentPet?.shelter?.phone;
  if (phone) {
    window.location.href = `tel:${phone}`;
  } else {
    alert("Shelter phone number is not available.");
  }
}

// ---------- Adoption Modal ----------
function openAdoptionModal() {
  if (!contactModal) return;

  modalTitle.textContent = `Contact About ${currentPet.name}`;

  const s = currentPet.shelter;

  modalShelterInfo.innerHTML = `
    <div class="shelter-header">
      ${
        s.verified
          ? `
        <div class="verified-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
      `
          : ""
      }
      <div>
        <h4>${s.name}</h4>
        ${s.verified ? '<div class="verified">Verified Shelter</div>' : ""}
      </div>
    </div>
    <div class="contact-list" style="margin-top: 1rem;">
      ${
        s.phone
          ? `
      <div class="contact-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
        <a href="tel:${s.phone}">${s.phone}</a>
      </div>`
          : ""
      }
      ${
        s.email
          ? `
      <div class="contact-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        <a href="mailto:${s.email}">${s.email}</a>
      </div>`
          : ""
      }
      ${
        s.address
          ? `
      <div class="contact-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>${s.address}</span>
      </div>`
          : ""
      }
    </div>
  `;

  // Optional: pre-fill message text with pet name
  const messageField = contactForm?.querySelector("textarea");
  if (messageField && !messageField.value) {
    messageField.value = `I'm interested in adopting ${currentPet.name}.`;
  }

  contactModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeContactModal() {
  if (!contactModal) return;
  contactModal.classList.remove("active");
  contactForm?.reset();
  document.body.style.overflow = "";
}

// ---------- Adoption submit ----------
async function submitAdoptionForm(e) {
  e.preventDefault();

  if (!currentPet) return;

  // Grab values based on current HTML
  const nameInput = contactForm.querySelector(
    'input[placeholder="Enter your full name"]'
  );
  const emailInput = contactForm.querySelector('input[type="email"]');
  const phoneInput = contactForm.querySelector(
    'input[placeholder="+92 300 1234567"]'
  );
  const messageInput = contactForm.querySelector("textarea");

  const name = nameInput?.value.trim() || "";
  const email = emailInput?.value.trim() || "";
  const phone = phoneInput?.value.trim() || "";
  const message = messageInput?.value.trim() || "";

  if (!name || !email || !phone || !message) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const { data, error } = await supabase.from("adoption").insert({
      pet_id: currentPet.id,
      shelter_id: currentPet.shelter.id,
      name,
      email,
      phone,
      message,
      status: "Pending"
    });

    if (error) {
      console.error("Error inserting adoption:", error);
      alert(
        "❌ Failed: Could not save your adoption request. " + error.message
      );
      return;
    }

    closeContactModal();

    successMessage.textContent = `Your adoption request for ${currentPet.name} has been sent.`;
    successModal.classList.add("active");
    setTimeout(() => {
      successModal.classList.remove("active");
    }, 2500);
  } catch (err) {
    console.error("Unexpected error inserting adoption:", err);
    alert("Something went wrong while saving your request.");
  }
}

// ---------- Central details (green about card etc.) ----------
function renderCentralDetails() {
  const container = document.getElementById("centralDetails");
  if (!container) return;

  const aboutHTML = `
    <div class="detail-card about">
      <h3>About ${currentPet.name}</h3>
      <p>${currentPet.description}</p>
    </div>`;

  const healthHTML = `
    <div class="health-card">
      <h3>Health & History</h3>
      <div class="health-table">
        <div class="health-row"><span class="label">Overall Health</span><span class="value">${currentPet.healthStatus ||
          "-"}</span></div>
        <div class="health-row"><span class="label">Last Vet Visit</span><span class="value">${currentPet.healthHistory.lastVetVisit}</span></div>
        <div class="health-row"><span class="label">Diet</span><span class="value">${currentPet.healthHistory.diet}</span></div>
        <div class="health-row"><span class="label">Vaccinations</span><span class="value">${currentPet.healthHistory.vaccinations}</span></div>
      </div>
    </div>`;

  const adoptionHTML = `
    <div class="adoption-card">
      <h3>Adoption Details</h3>
      <div class="adoption-fee">
        <label>Fee</label>
        <div class="price">PKR ${Number(currentPet.fee || 0).toLocaleString()}</div>
      </div>
      <label style="display:block; color:#666; margin-top:0.75rem;">Requirements</label>
      <ul class="requirements-list">
        ${
          currentPet.requirements.length
            ? currentPet.requirements.map((req) => `<li>${req}</li>`).join("")
            : "<li>No special requirements listed.</li>"
        }
      </ul>
    </div>`;

  const shelter = currentPet.shelter;
  const shelterHTML = `
    <div class="shelter-card">
      <h3>${shelter.name}${shelter.verified ? " ✓" : ""}</h3>
      <div class="contact-list">
        ${
          shelter.phone
            ? `<div class="contact-item"><i class="fas fa-phone"></i> <a href="tel:${shelter.phone}">${shelter.phone}</a></div>`
            : ""
        }
        ${
          shelter.email
            ? `<div class="contact-item"><i class="fas fa-envelope"></i> <a href="mailto:${shelter.email}">${shelter.email}</a></div>`
            : ""
        }
        ${
          shelter.address
            ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> <span>${shelter.address}</span></div>`
            : ""
        }
      </div>
    </div>`;

  const encourageHTML = `
    <div class="encouragement-card">
      <div>
        <p style="font-weight:700; margin:0;">Give ${currentPet.name} a loving home ❤️</p>
        <p class="note" style="margin:6px 0 0;">Every adoption saves a life and makes room for another animal in need.</p>
      </div>
    </div>`;

  container.innerHTML =
    aboutHTML + healthHTML + adoptionHTML + shelterHTML + encourageHTML;
}

// ---------- Global listeners ----------
function attachEventListeners() {
  closeModal?.addEventListener("click", closeContactModal);
  cancelBtn?.addEventListener("click", closeContactModal);
  contactForm?.addEventListener("submit", submitAdoptionForm);

  contactModal?.addEventListener("click", (e) => {
    if (e.target === contactModal) {
      closeContactModal();
    }
  });

  window.addEventListener("resize", debounce(syncInfoHeight, 120));
}
function contactShelterDirect() {
  const phone = currentPet?.shelter?.phone;

  if (!phone) {
    alert("Shelter phone number is not available.");
    return;
  }

  // Open dialer
  window.location.href = `tel:${phone}`;
}
