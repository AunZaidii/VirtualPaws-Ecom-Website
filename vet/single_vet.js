import { apiClient } from "../utils/apiClient.js";

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

  try {
    const data = await apiClient.get("getVet", { id: vetId });

  // --- Vet Image ---
  const imgEl = document.querySelector(".vet-photo");
  imgEl.src = data.image_url || "../placeholder.png";
  imgEl.alt = data.name;

  // Header
  document.querySelector(".name").textContent = data.name;
  document.querySelector(".specialty").textContent =
    data.category || "Veterinarian";

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
    (data.education?.split("\n") || ["No education added"])
      .map((e) => `<li>${e}</li>`)
      .join("");

  // Experience
  document.querySelector(".exp-list").innerHTML =
    (data.experience?.split("\n") || ["No experience added"])
      .map((e) => `<li>${e}</li>`)
      .join("");

  // Reviews
  const reviewBox = document.querySelector(".reviews-container");
  if (data.reviews) {
    reviewBox.innerHTML = data.reviews
      .split("\n")
      .map((r) => `<p class="review-text">⭐ ${r}</p>`)
      .join("");
  }

  // Clinic Address
  document.querySelector(".clinic-address").textContent =
    data.clinicAddress || "Not provided";

  // Map
  const encoded = encodeURIComponent(data.clinicAddress || "Karachi");
  document.querySelector(".map-frame").src =
    `https://maps.google.com/maps?q=${encoded}&output=embed`;
  } catch (error) {
    console.error("Load error:", error);
  }
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

    try {
      const result = await apiClient.post("createAppointment", {
        vet_id: vetId,
        name,
        phone,
        date,
        time,
        notes,
      });

    console.log("Vet booking request submitted:", result);
    successMsg.style.display = "block";
    form.reset();
    } catch (error) {
      console.error(error);
      errorMsg.style.display = "block";
    }
  });
}

// ------------------ Init ------------------

loadVet();
setupForm();
