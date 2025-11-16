import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ------------------ Helpers ------------------

function getVetId() {
  return new URL(window.location.href).searchParams.get("id");
}

function convertTo24Hour(timeStr) {
  if (!timeStr) return null;
  return `${timeStr}:00`; // your input is already 24h format
}

// ------------------ Load Vet ------------------

async function loadVet() {
  const vetId = getVetId();
  if (!vetId) return console.log("❌ No vet ID found");

  const { data, error } = await supabase
    .from("vet")
    .select("*")
    .eq("vet_id", vetId)
    .single();

  if (error) return console.error("Load error:", error);

  // Header
  document.querySelector(".name").textContent = data.name;
  document.querySelector(".specialty").textContent = data.category || "Veterinarian";

  document.querySelector(".contact-list").innerHTML = `
    <li><strong>Phone:</strong> ${data.phone || "N/A"}</li>
    <li><strong>Email:</strong> ${data.email || "N/A"}</li>
    <li><strong>Clinic:</strong> ${data.clinicAddress || "Not provided"}</li>
  `;

  // About
  document.querySelector(".lead").textContent =
    data.description || "No description provided.";

  // Education
  document.querySelector(".edu-list").innerHTML =
    (data.education?.split("\n") || ["No education added"]).map(
      (e) => `<li>${e}</li>`
    ).join("");

  // Experience
  document.querySelector(".exp-list").innerHTML =
    (data.experience?.split("\n") || ["No experience added"]).map(
      (e) => `<li>${e}</li>`
    ).join("");

  // Reviews
  const reviewBox = document.querySelector(".reviews-container");
  if (data.reviews) {
    reviewBox.innerHTML = data.reviews
      .split("\n")
      .map((r) => `<p class="review-text">⭐ ${r}</p>`)
      .join("");
  }

  // Clinic Address Text
  document.querySelector(".clinic-address").textContent =
    data.clinicAddress || "Not provided";

  // Map
  const mapFrame = document.querySelector(".map-frame");
  const encoded = encodeURIComponent(data.clinicAddress || "Karachi");
  mapFrame.src = `https://maps.google.com/maps?q=${encoded}&output=embed`;
}

// ------------------ Appointment ------------------

function setupForm() {
  const form = document.querySelector("#appointmentForm");
  const successMsg = document.querySelector("#successMsg");
  const errorMsg = document.querySelector("#errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    successMsg.style.display = "none";
    errorMsg.style.display = "none";

    const vetId = getVetId();

    const name = document.querySelector("#custName").value;
    const phone = document.querySelector("#custPhone").value;
    const date = document.querySelector("#custDate").value;
    const time = convertTo24Hour(document.querySelector("#custTime").value);
    const notes = document.querySelector("#custNotes").value;

    const { error } = await supabase.from("appointment").insert([
      {
        vet_id: vetId,
        user_id: null,
        name,
        phone,
        date,
        time,
        status: "pending",
        notes,
      },
    ]);

    if (error) {
      console.error(error);
      errorMsg.style.display = "block";
      return;
    }

    successMsg.style.display = "block";
    form.reset();
  });
}

// ------------------ Init ------------------

loadVet();
setupForm();
