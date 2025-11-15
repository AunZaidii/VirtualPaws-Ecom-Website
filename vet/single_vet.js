import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Get vet_id from URL
const vetId = new URLSearchParams(window.location.search).get("id");
if (!vetId) {
  alert("Invalid vet profile URL: missing vet ID.");
}

// Load Vet Details
async function loadVet() {
  const { data, error } = await supabase.from("vet").select("*").eq("vet_id", vetId).single();

  if (error || !data) {
    console.error("Failed to load vet:", error);
    return;
  }

  const vet = data;

  document.getElementById("vetName").textContent = vet.name;
  document.getElementById("vetCategory").textContent = vet.category || "Veterinarian";
  document.getElementById("vetPhone").textContent = vet.phone || "N/A";
  document.getElementById("vetEmail").textContent = vet.email || "N/A";
  document.getElementById("vetAddress").textContent = vet.clinicaddress || "N/A";
  document.getElementById("sideClinicAddress").textContent = vet.clinicaddress || "N/A";

  document.getElementById("vetDescription").textContent = vet.description || "No description available.";

  document.getElementById("vetImage").src =
    vet.image_url || "https://cdn-icons-png.flaticon.com/512/921/921089.png";

  // Services
  const servicesContainer = document.getElementById("vetServices");
  const services = vet.reviews ? vet.reviews.split(",") : [];

  servicesContainer.innerHTML = services
    .map((s) => `<span class="service-pill">${s.trim()}</span>`)
    .join("");

  // Education
  const eduList = document.getElementById("vetEducation");
  if (vet.education) {
    eduList.innerHTML = vet.education
      .split(",")
      .map((e) => `<li>${e.trim()}</li>`)
      .join("");
  }

  // Experience
  const expList = document.getElementById("vetExperience");
  if (vet.experience) {
    expList.innerHTML = vet.experience
      .split(",")
      .map((e) => `<li>${e.trim()}</li>`)
      .join("");
  }

  // Map
  document.getElementById("clinicMap").src =
    `https://maps.google.com/?q=${encodeURIComponent(vet.clinicaddress)}&output=embed`;
}

loadVet();


// ---------------- APPOINTMENT LOGIC ----------------

const appointmentForm = document.getElementById("appointmentForm");
const messageBox = document.getElementById("appointmentMessage");

appointmentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userName = document.getElementById("userName").value.trim();
  const userPhone = document.getElementById("userPhone").value.trim();
  const date = document.getElementById("appointDate").value;
  const time = document.getElementById("appointTime").value;
  const notes = document.getElementById("userNotes").value.trim();

  const combinedNotes = `
Name: ${userName}
Phone: ${userPhone}
User Notes: ${notes}
  `;

  const { data, error } = await supabase.from("appointment").insert([
    {
      vet_id: vetId,
      user_id: null,
      date: date,
      time: time,
      status: "pending",
      notes: combinedNotes
    }
  ]);

  if (error) {
    console.error(error);
    messageBox.style.color = "red";
    messageBox.textContent = "❌ Failed to book appointment.";
    return;
  }

  messageBox.style.color = "green";
  messageBox.textContent = "✅ Appointment booked successfully!";

  appointmentForm.reset();
});
