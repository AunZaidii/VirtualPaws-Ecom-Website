// ---------- Supabase Initialization ----------
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- Fetch and Render Vets ----------
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("vetContainer");

  try {
    const { data: vets, error } = await supabase
      .from("vet")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    if (!vets || vets.length === 0) {
      container.innerHTML = "<p>No vets found in the database.</p>";
      return;
    }

    container.innerHTML = ""; // Clear placeholder

    vets.forEach((vet) => {
      const card = document.createElement("div");
      card.classList.add("vet-card");

      // random placeholder photo if none provided
      const avatarUrl =
        vet.photo_url ||
        `https://randomuser.me/api/portraits/${
          Math.random() > 0.5 ? "men" : "women"
        }/${Math.floor(Math.random() * 80)}.jpg`;

      card.innerHTML = `
        <div class="vet-header">
          <img class="vet-avatar" src="${avatarUrl}" alt="${vet.name}" loading="lazy" />
          <div class="vet-heading">
            <h3>${vet.name}</h3>
            <div class="vet-specialty">${vet.category || "Veterinarian"}</div>
          </div>
        </div>

        <div class="vet-info">
          <div class="info-item">
            <i class="fa-solid fa-phone"></i> <span>${vet.phone || "N/A"}</span>
          </div>
          <div class="info-item">
            <i class="fa-solid fa-envelope"></i> <span>${vet.email || "N/A"}</span>
          </div>
          <div class="info-item">
            <i class="fa-solid fa-location-dot"></i> <span>${
              vet.clinicAddress || "Not available"
            }</span>
          </div>
          <div class="info-item">
            <i class="fa-solid fa-star"></i> <span>Rating: ${
              vet.rating || "N/A"
            }</span>
          </div>
        </div>

        <button class="book-btn" type="button">View Profile</button>
      `;

      // Event: open modal on button click
      card
        .querySelector(".book-btn")
        .addEventListener("click", () => openModal(vet));

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching vets:", err.message);
    container.innerHTML = `<p style="color:red;">Error loading vets. Check console for details.</p>`;
  }
});

// ---------- Modal Handling ----------
function openModal(vet) {
  const modal = document.getElementById("vetModal");
  document.getElementById("modalName").textContent = vet.name || "Unnamed Vet";
  document.getElementById("modalSpecialty").textContent =
    vet.category || "Veterinarian";
  document.getElementById("modalBio").textContent =
    vet.description || "No description available.";
  document.getElementById("modalExperience").textContent =
    vet.experience || "Experience not specified.";
  document.getElementById("modalEducation").textContent =
    vet.education || "Education not specified.";

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("vetModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("vetModal");
  if (event.target === modal) closeModal();
};

// Close modal with ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});

// ---------- Booking Logic ----------
function bookAppointment() {
  const vetName = document.getElementById("modalName").textContent;
  alert(`Booking system not yet active.\n\nPlease contact ${vetName} via phone or email for appointments.`);
  closeModal();
}

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
