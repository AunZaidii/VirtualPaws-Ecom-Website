import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ---------------- Supabase Setup ----------------
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------------- Get Vet ID From URL ----------------
function getVetId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id");
}

// ---------------- TIME Conversion (12 → 24 Hour) ----------------
function convertTo24Hour(timeStr) {
  if (!timeStr) return null;

  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") hours = String(Number(hours) + 12);
  if (modifier === "AM" && hours === "12") hours = "00";

  return `${hours}:${minutes}:00`;
}

// ---------------- Load Vet Details ----------------
async function loadVet() {
  const vetId = getVetId();
  if (!vetId) {
    console.error("No vet ID in URL");
    return;
  }

  const { data, error } = await supabase
    .from("vet")
    .select("*")
    .eq("vet_id", vetId)
    .single();

  if (error) {
    console.error("Error loading vet:", error);
    return;
  }

  document.querySelector(".name").textContent = data.name;
  document.querySelector(".specialty").textContent = data.category || "Veterinarian";

  document.querySelector(".contact-list").innerHTML = `
    <li><strong>Phone:</strong> ${data.phone}</li>
    <li><strong>Email:</strong> ${data.email}</li>
    <li><strong>Clinic:</strong> ${data.clinicaddress}</li>
  `;

  document.querySelector(".lead").textContent =
    data.description || "No description provided.";

  // Education
  const eduList = data.education?.split("\n") || [];
  document.querySelector(".edu-col ul").innerHTML = eduList
    .map((e) => `<li>${e}</li>`)
    .join("");

  // Experience
  const expList = data.experience?.split("\n") || [];
  document.querySelectorAll(".edu-col ul")[1].innerHTML = expList
    .map((e) => `<li>${e}</li>`)
    .join("");

  // Reviews (simple)
  const reviewBox = document.querySelector(".reviews-container");
  if (reviewBox && data.reviews) {
    const reviewList = data.reviews.split("\n");
    reviewBox.innerHTML = reviewList
      .map((r) => `<p class="review-text">⭐ ${r}</p>`)
      .join("");
  }
}

// ---------------- Submit Appointment ----------------
async function setupForm() {
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
    const timeRaw = document.querySelector("#custTime").value;
    const notes = document.querySelector("#custNotes").value;

    // Fix time
    const time24 = convertTo24Hour(timeRaw);

    // Combine name/phone into notes because table has no name/phone columns
    const combinedNotes = `Name: ${name}\nPhone: ${phone}\nNotes: ${notes}`;

    console.log("📤 Inserting appointment…");

    const { data, error } = await supabase.from("appointment").insert([
      {
    vet_id: vetId,
    user_id: null,          // still null until you add login system
    name: name,             // now stored separately
    phone: phone,           // numeric column (int8)
    date: date,
    time: time24,
    status: "pending",
    notes: notes            // only the notes you typed
  }
    ]);

    console.log("Insert error:", error); // DEBUG — SHOW ME ERROR IN CONSOLE

    if (error) {
      errorMsg.style.display = "block";
      return;
    }

    successMsg.style.display = "block";
    form.reset();
  });
}

// ---------------- Initialize ----------------
loadVet();
setupForm();
