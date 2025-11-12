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

      // ✅ Redirect to single_vet.html when clicked
      const button = card.querySelector(".book-btn");
      button.addEventListener("click", () => {
        // Pass vet_id in URL
        window.location.href = `../vet/single_vet.html?id=${vet.vet_id}`;
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching vets:", err.message);
    container.innerHTML = `<p style="color:red;">Error loading vets. Check console for details.</p>`;
  }
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
