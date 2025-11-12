// ✅ vet.js (final working version for your "vet" table)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// --- Your Supabase credentials ---
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

// --- Initialize Supabase ---
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Get the container for vet cards ---
const vetGrid = document.querySelector(".vet-grid");

// --- Main function to load vets ---
async function loadVets() {
  console.log("➡️ Starting to load vets...");

  try {
    // ✅ Correct table name for your schema
    const { data: vets, error } = await supabase.from("vet").select("*");
    console.log("✅ Supabase response:", { vets, error });

    if (error) throw error;

    if (!vets || vets.length === 0) {
      vetGrid.innerHTML = `<p style="color:red; text-align:center;">No vets found in database.</p>`;
      return;
    }

    // Clear any previous content
    vetGrid.innerHTML = "";

    // --- Create Vet Cards ---
    vets.forEach((vet) => {
      const imageUrl = vet.image_url || "https://via.placeholder.com/120?text=Vet";

<<<<<<< Updated upstream
      const avatarUrl =
        vet.image_url ||
        `https://randomuser.me/api/portraits/${
          Math.random() > 0.5 ? "men" : "women"
        }/${Math.floor(Math.random() * 80)}.jpg`;

      card.innerHTML = `
        <div class="vet-header">
          <img class="vet-avatar" src="${avatarUrl}" alt="${vet.name}" loading="lazy" />
          <div class="vet-heading">
            <h3>${vet.name}</h3>
            <div class="vet-specialty">${vet.category || "Veterinarian"}</div>
=======
      const vetCard = `
        <div class="vet-card">
          <div class="vet-header">
            <img src="${imageUrl}" alt="${vet.name}" class="vet-avatar" />
            <div class="vet-heading">
              <h3>${vet.name}</h3>
              <p class="vet-specialty">${vet.category || "Veterinary Specialist"}</p>
            </div>
>>>>>>> Stashed changes
          </div>

          <div class="vet-info">
            <div class="info-item">
              <i class="fa-solid fa-phone" style="color:#8DC63F; margin-right:10px;"></i>
              <span>${vet.phone || "N/A"}</span>
            </div>
            <div class="info-item">
              <i class="fa-solid fa-envelope" style="color:#8DC63F; margin-right:10px;"></i>
              <span>${vet.email || "N/A"}</span>
            </div>
            <div class="info-item">
              <i class="fa-solid fa-location-dot" style="color:#8DC63F; margin-right:10px;"></i>
              <span>${vet.clinicAddress || "N/A"}</span>
            </div>
            <div class="info-item">
              <i class="fa-solid fa-star" style="color:#8DC63F; margin-right:10px;"></i>
              <span>Rating: ${vet.rating || "N/A"}</span>
            </div>
          </div>

          <button class="book-btn">View Profile</button>
        </div>
      `;

<<<<<<< Updated upstream
      // ✅ Redirect to single_vet.html when clicked
      const button = card.querySelector(".book-btn");
      button.addEventListener("click", () => {
        // Pass vet_id in URL
        window.location.href = `../vet/single_vet.html?id=${vet.vet_id}`;
      });

      container.appendChild(card);
=======
      vetGrid.insertAdjacentHTML("beforeend", vetCard);
>>>>>>> Stashed changes
    });
  } catch (err) {
    console.error("💥 Error loading vets:", err);
    vetGrid.innerHTML = `<p style="color:red; text-align:center;">Failed to load vet profiles.</p>`;
  }
<<<<<<< Updated upstream
});

// ---------- Extra Buttons ----------
function getDirections() {
  window.open(
    "https://maps.google.com/?q=Virtual+Paws+Vet+Hospital+Karachi",
    "_blank"
  );
}

function scrollToVets() {
  document
    .getElementById("vet-profiles")
    .scrollIntoView({ behavior: "smooth" });
}
=======
}

// --- Call function on load ---
loadVets();
>>>>>>> Stashed changes
