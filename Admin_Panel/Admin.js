// ---------- Supabase Init ----------
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- Local state ----------
let products = [];
let vets = [];
let pets = [];
let shelters = [];
let adoptions = []; // NEW
let appointments = [];

const orders = {
  pending: 12,
  completed: 145,
  cancelled: 3,
};

// ---------- Upload helper ----------
async function uploadImages(fileList, bucketName) {
  const files = Array.from(fileList).slice(0, 3);
  const urls = [];

  for (const file of files) {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error } = await db.storage.from(bucketName).upload(fileName, file);
    if (error) {
      console.error("Upload error:", error);
      alert("Error uploading image(s).");
      continue;
    }

    const { data: publicData } = db.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    urls.push(publicData.publicUrl);
  }

  return urls;
}

// ---------- Navigation ----------
function showSection(sectionName, evt) {
  document.querySelectorAll(".section").forEach((sec) => sec.classList.add("hidden"));
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"));

  const section = document.getElementById(sectionName + "-section");
  if (section) section.classList.remove("hidden");

  if (evt && evt.target) evt.target.closest(".nav-btn").classList.add("active");

  if (sectionName === "view-products") renderProducts();
  if (sectionName === "view-vets") renderVets();
  if (sectionName === "view-pets") renderPets();
  if (sectionName === "view-shelters") renderShelters();
  if (sectionName === "view-adoptions") renderAdoptions(); // NEW
  if (sectionName === "dashboard") updateDashboard();
  if (sectionName === "view-appointments") renderAppointments();

}

window.showSection = showSection;

// ---------- Load Data ----------
async function loadData() {
  const [
    { data: prodData },
    { data: vetData },
    { data: petData },
    { data: shelterData },
    { data: adoptionData },
    { data: appointmentData }
  ] = await Promise.all([
      db.from("product").select("*"),
      db.from("vet").select("*"),
      db.from("pet").select("*"),
      db.from("shelter").select("*"),
      db.from("adoption").select("*"),
      db.from("appointment").select("*")   // NEW
  ]);

  products = prodData || [];
  vets = vetData || [];
  pets = petData || [];
  shelters = shelterData || [];
  adoptions = adoptionData || []; // NEW
  appointments = appointmentData || [];

  updateDashboard();
}

// ---------- Product Form ----------
document.getElementById("product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const imageInput = document.getElementById("product-images");
  const imageUrls = await uploadImages(imageInput.files, "product-images");

  const { data, error } = await db
    .from("product")
    .insert({
      name: formData.get("name"),
      price: parseFloat(formData.get("price")),
      stock: parseInt(formData.get("stock")),
      category: formData.get("category"),
      description: formData.get("description"),
      image: imageUrls[0] || null,
      hoverimage: imageUrls[1] || null,
      rating: parseFloat(formData.get("rating")),
      vendor: formData.get("vendor"),
      tags: formData.get("tags"),
      material: formData.get("material"),
      size: formData.get("size"),
      review: formData.get("review"),
    })
    .select()
    .single();

  if (error) {
    console.error("Product insert error:", error);
    alert("Error adding product.");
    return;
  }

  products.push(data);
  e.target.reset();
  imageInput.value = "";
  alert("Product added successfully!");
  updateDashboard();
});

// ---------- Vet Form ----------
document.getElementById("vet-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const imageInput = document.getElementById("vet-images");
  const imageUrls = await uploadImages(imageInput.files, "vet-images");

  const { data, error } = await db
    .from("vet")
    .insert({
      name: formData.get("name"),
      category: formData.get("expertise"),
      phone: formData.get("contact"),
      email: formData.get("email"),
      clinicAddress: formData.get("clinicAddress"),
      description: formData.get("description"),
      experience: parseInt(formData.get("experience")),
      rating: parseFloat(formData.get("rating")),
      education: formData.get("education"),
      reviews: formData.get("reviews"),
      image_url: imageUrls[0] || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Vet insert error:", error);
    alert("Error adding vet.");
    return;
  }

  vets.push(data);
  e.target.reset();
  imageInput.value = "";
  alert("Vet added successfully!");
  updateDashboard();
});

// ---------- Pet Form ----------
document.getElementById("pet-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const imgInput = document.getElementById("pet-images");
  const imageUrls = await uploadImages(imgInput.files, "pet-images");

  const { data, error } = await db
    .from("pet")
    .insert([
      {
        name: formData.get("name"),
        breed: formData.get("breed"),
        species: formData.get("species"),
        gender: formData.get("gender"),
        age: parseInt(formData.get("age")),
        size: formData.get("size"),
        color: formData.get("color"),
        temperament: formData.get("temperament"),
        tags: formData.get("tags"),
        health_status: formData.get("health_status"),
        location: formData.get("location"),
        description: formData.get("description"),
        last_vet_visit: formData.get("lastVetVisit") || null,
        diet: formData.get("diet"),
        vaccinations: formData.get("vaccinations"),
        fee: parseFloat(formData.get("adoptionFees")),
        adoption_req: formData.get("adoptionRequirement") || null,
        shelter_name: formData.get("shelter_name") || null,
        image1: imageUrls[0] || null,
        image2: imageUrls[1] || null,
        image3: imageUrls[2] || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Pet insert error:", error);
    alert("Error adding pet.");
    return;
  }

  pets.push(data);
  e.target.reset();
  imgInput.value = "";
  alert("Pet added successfully!");
  updateDashboard();
});

// ---------- Shelter Form ----------
document.getElementById("shelter-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const { data, error } = await db
    .from("shelter")
    .insert({
      shelter_name: formData.get("shelter_name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      verified: formData.get("verified") === "true",
    })
    .select()
    .single();

  if (error) {
    console.error("Shelter insert error:", error);
    alert("Error adding shelter.");
    return;
  }

  shelters.push(data);
  e.target.reset();
  alert("Shelter added successfully!");
  updateDashboard();
});

// ---------- Render Products ----------
function renderProducts() {
  const container = document.getElementById("products-list");
  document.getElementById("products-count").textContent = products.length;

  if (products.length === 0) {
    container.innerHTML = `<p>No products found.</p>`;
    return;
  }

  container.innerHTML =
    '<div class="items-grid">' +
    products
      .map(
        (p) =>
          `
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">${p.name}</div>
          <button class="btn-danger" onclick="deleteProduct('${p.product_id}')">✕</button>
        </div>
        <p>${p.description || ""}</p>
        <div class="item-details">
          <div><strong>Price:</strong> ${p.price}</div>
          <div><strong>Stock:</strong> ${p.stock}</div>
          <div><strong>Category:</strong> ${p.category}</div>
        </div>
      </div>
    `
      )
      .join("") +
    "</div>";
}

// ---------- Render Vets ----------
function renderVets() {
  const container = document.getElementById("vets-list");
  document.getElementById("vets-count").textContent = vets.length;

  if (vets.length === 0) {
    container.innerHTML = `<p>No vets found.</p>`;
    return;
  }

  container.innerHTML =
    '<div class="items-grid">' +
    vets
      .map(
        (v) =>
          `
      <div class="item-card">
        ${v.image_url ? `<img src="${v.image_url}" class="item-image">` : ""}
        <div class="item-header">
          <div class="item-title">${v.name}</div>
          <button class="btn-danger" onclick="deleteVet('${v.vet_id}')">✕</button>
        </div>
        <p>${v.description || ""}</p>
        <div class="item-details">
          <div><strong>Email:</strong> ${v.email}</div>
          <div><strong>Clinic:</strong> ${v.clinicAddress}</div>
          <div><strong>Experience:</strong> ${v.experience} years</div>
        </div>
      </div>
    `
      )
      .join("") +
    "</div>";
}

// ---------- Render Pets ----------
function renderPets() {
  const container = document.getElementById("pets-list");
  document.getElementById("pets-count").textContent = pets.length;

  if (pets.length === 0) {
    container.innerHTML = `<p>No pets found.</p>`;
    return;
  }

  container.innerHTML =
    '<div class="items-grid">' +
    pets
      .map(
        (p) =>
          `
      <div class="item-card">
        ${p.image1 ? `<img src="${p.image1}" class="item-image">` : ""}
        <div class="item-header">
          <div class="item-title">${p.name}</div>
          <button class="btn-danger" onclick="deletePet('${p.pet_id}')">✕</button>
        </div>
        <p>${p.description || ""}</p>
        <div class="item-details">
          <div><strong>Age:</strong> ${p.age}</div>
          <div><strong>Gender:</strong> ${p.gender}</div>
          <div><strong>Location:</strong> ${p.location}</div>
        </div>
      </div>
    `
      )
      .join("") +
    "</div>";
}

// ---------- Render Shelters ----------
function renderShelters() {
  const container = document.getElementById("shelters-list");
  document.getElementById("shelters-count").textContent = shelters.length;

  if (shelters.length === 0) {
    container.innerHTML = `<p>No shelters found.</p>`;
    return;
  }

  container.innerHTML =
    '<div class="items-grid">' +
    shelters
      .map(
        (s) =>
          `
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">${s.shelter_name} ${s.verified ? "✔️" : ""}</div>
          <button class="btn-danger" onclick="deleteShelter('${s.shelter_id}')">✕</button>
        </div>
        <div class="item-details">
          <div><strong>Phone:</strong> ${s.phone || "N/A"}</div>
          <div><strong>Email:</strong> ${s.email || "N/A"}</div>
          <div><strong>Address:</strong> ${s.address || "N/A"}</div>
        </div>
      </div>
    `
      )
      .join("") +
    "</div>";
}
function renderAppointments() {
  const container = document.getElementById("appointments-list");
  document.getElementById("appointments-count").textContent = appointments.length;

  if (appointments.length === 0) {
    container.innerHTML = `<p>No vet booking requests found.</p>`;
    return;
  }

  container.innerHTML =
    '<div class="items-grid">' +
    appointments
      .map(
        (req) => `
        <div class="item-card">

          <div class="item-header">
            <div class="item-title">Booking #${req.appointment_id}</div>
          </div>

          <div class="item-details">
            <p><strong>Name:</strong> ${req.name || "Unknown"}</p>
            <p><strong>Phone:</strong> ${req.phone || "N/A"}</p>
            <p><strong>Vet ID:</strong> ${req.vet_id || "N/A"}</p>
            <p><strong>Date:</strong> ${req.date}</p>
            <p><strong>Time:</strong> ${req.time}</p>
            <p><strong>Notes:</strong> ${req.notes || "No notes"}</p>
            <p><strong>Status:</strong> ${req.status}</p>
          </div>

          <div class="action-buttons">
            <button class="btn-primary" onclick="updateAppointmentStatus('${req.appointment_id}', 'accepted')">✓ Accept</button>
            <button class="btn-danger" onclick="updateAppointmentStatus('${req.appointment_id}', 'rejected')">✕ Reject</button>
          </div>


        </div>
      `
      )
      .join("") +
    "</div>";
}
async function updateAppointmentStatus(appointment_id, newStatus) {
  console.log("Updating:", appointment_id, newStatus);

  const { error } = await db
    .from("appointment")
    .update({ status: newStatus })
    .eq("appointment_id", appointment_id);

  if (error) {
    console.error("Update Error:", error);
    alert("Error updating appointment.");
    return;
  }

  appointments = appointments.map((a) =>
    a.appointment_id === appointment_id ? { ...a, status: newStatus } : a
  );

  renderAppointments();
  alert(`Appointment ${newStatus}!`);
}

window.updateAppointmentStatus = updateAppointmentStatus;

function renderAdoptions() {
  const container = document.getElementById("adoption-list");
  document.getElementById("adoptions-count").textContent = adoptions.length;

  if (adoptions.length === 0) {
    container.innerHTML = `<p>No adoption requests found.</p>`;
    return;
  }

  container.innerHTML =
    '<div class="items-grid">' +
    adoptions
      .map(
        (req) => `
      <div class="item-card">

        <div class="item-header">
          <div class="item-title">Request #${req.adoption_id}</div>
        </div>

        <div class="item-details">
          <p><strong>Name:</strong> ${req.name}</p>
          <p><strong>Email:</strong> ${req.email}</p>
          <p><strong>Phone:</strong> ${req.phone}</p>
          <p><strong>Pet ID:</strong> ${req.pet_id}</p>
          <p><strong>Shelter ID:</strong> ${req.shelter_id}</p>
          <p><strong>Message:</strong> ${req.message || "No message"}</p>
          <p><strong>Status:</strong> ${req.adoptionStatus}</p>
        </div>
        <div class="action-buttons">
          <button class="btn-primary" onclick="updateAdoptionStatus('${req.adoption_id}', 'accepted')">✓ Accept</button>
          <button class="btn-danger" onclick="updateAdoptionStatus('${req.adoption_id}', 'rejected')">✕ Reject</button>
        </div>

      </div>
      `
      )
      .join("") +
    "</div>";
}

// ---------- Adoption Status Update (FIXED) ----------
async function updateAdoptionStatus(adoption_id, newStatus) {
  const { error } = await db
    .from("adoption")
    .update({ adoptionStatus: newStatus })
    .eq("adoption_id", adoption_id);

  if (error) {
    console.error("Update Error:", error);
    alert("Error updating request.");
    return;
  }

  adoptions = adoptions.map((req) =>
    req.adoption_id === adoption_id
      ? { ...req, adoptionStatus: newStatus }
      : req
  );

  renderAdoptions();
  alert(`Request ${newStatus}!`);
}

window.updateAdoptionStatus = updateAdoptionStatus;

// ---------- Delete ----------
async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  const { error } = await db.from("product").delete().eq("product_id", id);
  if (error) return alert("Error deleting product.");

  products = products.filter((p) => p.product_id !== id);
  renderProducts();
  updateDashboard();
}

async function deleteVet(id) {
  if (!confirm("Delete this vet?")) return;

  const { error } = await db.from("vet").delete().eq("vet_id", id);
  if (error) return alert("Error deleting vet.");

  vets = vets.filter((v) => v.vet_id !== id);
  renderVets();
  updateDashboard();
}

async function deletePet(id) {
  if (!confirm("Delete this pet?")) return;

  const { error } = await db.from("pet").delete().eq("pet_id", id);
  if (error) return alert("Error deleting pet.");

  pets = pets.filter((p) => p.pet_id !== id);
  renderPets();
  updateDashboard();
}

async function deleteShelter(id) {
  if (!confirm("Delete this shelter?")) return;

  const { error } = await db.from("shelter").delete().eq("shelter_id", id);
  if (error) return alert("Error deleting shelter.");

  shelters = shelters.filter((s) => s.shelter_id !== id);
  renderShelters();
  updateDashboard();
}

window.deleteProduct = deleteProduct;
window.deleteVet = deleteVet;
window.deletePet = deletePet;
window.deleteShelter = deleteShelter;

// ---------- Dashboard ----------
function updateDashboard() {
  document.getElementById("total-products").textContent = products.length;
  document.getElementById("total-vets").textContent = vets.length;
  document.getElementById("total-pets").textContent = pets.length;
  document.getElementById("total-shelters").textContent = shelters.length;

  document.getElementById("pending-orders").textContent = orders.pending;
  document.getElementById("completed-orders").textContent = orders.completed;
  document.getElementById("cancelled-orders").textContent = orders.cancelled;
}

// ---------- Init ----------
(async function init() {
  await loadData();
  updateDashboard();
})();
