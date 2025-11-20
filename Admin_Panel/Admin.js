// ---------- API Client Init ----------
import { apiClient } from "../utils/apiClient.js";

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
// Note: Image uploads still need Supabase storage access
// For now, using a simplified approach - you may need to create a storage upload function
async function uploadImages(fileList, bucketName) {
  // TODO: Create a Netlify function for image uploads or use a different storage solution
  // For now, returning empty array - you'll need to implement storage upload function
  console.warn("Image upload not yet implemented with Netlify functions");
  return [];
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
  try {
    const allData = await apiClient.get("adminGetAllData");
    
    products = allData.products || [];
    vets = allData.vets || [];
    pets = allData.pets || [];
    shelters = allData.shelters || [];
    adoptions = allData.adoptions || [];
    appointments = allData.appointments || [];

    updateDashboard();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// ---------- Product Form ----------
document.getElementById("product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const imageInput = document.getElementById("product-images");
  const imageUrls = await uploadImages(imageInput.files, "product-images");

  try {
    const data = await apiClient.post("adminAddProduct", {
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
    });

    products.push(data);
    e.target.reset();
    imageInput.value = "";
    alert("Product added successfully!");
    updateDashboard();
  } catch (error) {
    console.error("Product insert error:", error);
    alert(error.message || "Error adding product.");
  }
});

// ---------- Vet Form ----------
document.getElementById("vet-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const imageInput = document.getElementById("vet-images");
  const imageUrls = await uploadImages(imageInput.files, "vet-images");

  try {
    const data = await apiClient.post("adminAddVet", {
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
    });

    vets.push(data);
    e.target.reset();
    imageInput.value = "";
    alert("Vet added successfully!");
    updateDashboard();
  } catch (error) {
    console.error("Vet insert error:", error);
    alert(error.message || "Error adding vet.");
  }
});

// ---------- Pet Form ----------
document.getElementById("pet-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const imgInput = document.getElementById("pet-images");
  const imageUrls = await uploadImages(imgInput.files, "pet-images");

  try {
    const data = await apiClient.post("adminAddPet", {
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
    });

    pets.push(data);
    e.target.reset();
    imgInput.value = "";
    alert("Pet added successfully!");
    updateDashboard();
  } catch (error) {
    console.error("Pet insert error:", error);
    alert(error.message || "Error adding pet.");
  }
});

// ---------- Shelter Form ----------
document.getElementById("shelter-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const data = await apiClient.post("adminAddShelter", {
      shelter_name: formData.get("shelter_name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      verified: formData.get("verified") === "true",
    });

    shelters.push(data);
    e.target.reset();
    alert("Shelter added successfully!");
    updateDashboard();
  } catch (error) {
    console.error("Shelter insert error:", error);
    alert(error.message || "Error adding shelter.");
  }
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

  try {
    await apiClient.put("adminUpdateAppointmentStatus", {
      appointment_id,
      status: newStatus
    });

    appointments = appointments.map((a) =>
      a.appointment_id === appointment_id ? { ...a, status: newStatus } : a
    );

    renderAppointments();
    alert(`Appointment ${newStatus}!`);
  } catch (error) {
    console.error("Update Error:", error);
    alert(error.message || "Error updating appointment.");
  }
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
          <p><strong>Status:</strong> ${req.status}</p>
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
  try {
    await apiClient.put("adminUpdateAdoptionStatus", {
      adoption_id,
      status: newStatus
    });

    adoptions = adoptions.map((req) =>
      req.adoption_id === adoption_id
        ? { ...req, status: newStatus }
        : req
    );

    renderAdoptions();
    alert(`Request ${newStatus}!`);
  } catch (error) {
    console.error("Update Error:", error);
    alert(error.message || "Error updating request.");
  }
}

window.updateAdoptionStatus = updateAdoptionStatus;

// ---------- Delete ----------
async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  try {
    await apiClient.delete("adminDeleteProduct", { id });
    products = products.filter((p) => p.product_id !== id);
    renderProducts();
    updateDashboard();
  } catch (error) {
    alert(error.message || "Error deleting product.");
  }
}

async function deleteVet(id) {
  if (!confirm("Delete this vet?")) return;

  try {
    await apiClient.delete("adminDeleteVet", { id });
    vets = vets.filter((v) => v.vet_id !== id);
    renderVets();
    updateDashboard();
  } catch (error) {
    alert(error.message || "Error deleting vet.");
  }
}

async function deletePet(id) {
  if (!confirm("Delete this pet?")) return;

  try {
    await apiClient.delete("adminDeletePet", { id });
    pets = pets.filter((p) => p.pet_id !== id);
    renderPets();
    updateDashboard();
  } catch (error) {
    alert(error.message || "Error deleting pet.");
  }
}

async function deleteShelter(id) {
  if (!confirm("Delete this shelter?")) return;

  try {
    await apiClient.delete("adminDeleteShelter", { id });
    shelters = shelters.filter((s) => s.shelter_id !== id);
    renderShelters();
    updateDashboard();
  } catch (error) {
    alert(error.message || "Error deleting shelter.");
  }
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
