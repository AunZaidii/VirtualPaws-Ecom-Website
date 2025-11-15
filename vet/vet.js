import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// --- Supabase Credentials ---
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Container
const vetGrid = document.querySelector("#vetContainer");

// Load vets
async function loadVets() {
  try {
    const { data: vets, error } = await supabase.from("vet").select("*");

    if (error) throw error;

    if (!vets.length) {
      vetGrid.innerHTML = `<p style="text-align:center; font-size:20px; color:red;">No vets found.</p>`;
      return;
    }

    vetGrid.innerHTML = "";

    vets.forEach((vet) => {
      const profilePic =
        vet.image_url ||
        `https://randomuser.me/api/portraits/men/${Math.floor(
          Math.random() * 80
        )}.jpg`;

      const card = `
        <div class="vet-card">

          <div class="vet-header">
            <img src="${profilePic}" class="vet-avatar" alt="${vet.name}">
            <div class="vet-heading">
              <h3>${vet.name}</h3>
              <p class="vet-specialty">${vet.category || "Veterinary Expert"}</p>
            </div>
          </div>

          <div class="vet-info">
            <div class="info-item"><i class="fa-solid fa-phone"></i> ${vet.phone || "N/A"}</div>
            <div class="info-item"><i class="fa-solid fa-envelope"></i> ${vet.email || "N/A"}</div>
            <div class="info-item"><i class="fa-solid fa-location-dot"></i> ${vet.clinicAddress || "N/A"}</div>
            <div class="info-item"><i class="fa-solid fa-star"></i> Rating: ${vet.rating || 5}</div>
          </div>

          <button class="book-btn" data-id="${vet.vet_id}">
            View Profile
          </button>

        </div>
      `;

      vetGrid.insertAdjacentHTML("beforeend", card);
    });

    // Button click event → open single vet page
    document.querySelectorAll(".book-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const vetId = btn.dataset.id;
        window.location.href = `single_vet.html?id=${vetId}`;
      });
    });

  } catch (err) {
    console.error("ERROR LOADING VETS:", err);
    vetGrid.innerHTML =
      `<p style="text-align:center; font-size:20px; color:red;">Error loading vets.</p>`;
  }
}

loadVets();

// Utility — directions
window.getDirections = function () {
  window.open(
    "https://maps.google.com/?q=Virtual+Paws+Vet+Hospital+Karachi",
    "_blank"
  );
};
