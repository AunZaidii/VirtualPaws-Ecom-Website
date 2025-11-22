// ---------- API Client Init ----------
import { apiClient } from "../utils/apiClient.js";

// ---------- Short ID Generator ----------
function generateShortId(fullId) {
  // Generate 3 letters + 3 numbers from the full ID
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const hash = fullId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  let shortId = "";
  // Generate 3 letters
  for (let i = 0; i < 3; i++) {
    shortId += letters[Math.floor((hash * (i + 1)) % letters.length)];
  }
  // Generate 3 numbers
  for (let i = 0; i < 3; i++) {
    shortId += Math.floor((hash * (i + 7)) % 10);
  }
  
  return shortId;
}

// ---------- Local state ----------
let products = [];
let vets = [];
let pets = [];
let shelters = [];
let adoptions = []; // NEW
let appointments = [];
let orders = []; // NEW - for order management
let orderStats = {
  pending: 0,
  completed: 0,
  cancelled: 0,
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
  if (sectionName === "view-orders") renderOrders(); // NEW
  if (sectionName === "dashboard") updateDashboard();
  if (sectionName === "view-appointments") renderAppointments();

}

window.showSection = showSection;

// ---------- Load Data ----------
async function loadData() {
  try {
    console.log("Loading admin data...");
    const allData = await apiClient.get("adminGetAllData");
    
    console.log("Admin data received:", allData);
    
    products = allData.products || [];
    vets = allData.vets || [];
    pets = allData.pets || [];
    shelters = allData.shelters || [];
    adoptions = allData.adoptions || [];
    appointments = allData.appointments || [];

    console.log("Data loaded - Products:", products.length, "Vets:", vets.length, "Pets:", pets.length);

    updateDashboard();
  } catch (error) {
    console.error("Error loading data:", error);
    console.error("Error details:", error.message);
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
        (req) => {
          // Generate short booking ID from appointment_id
          const shortId = req.booking_id || generateShortId(req.appointment_id);
          
          // Find vet name
          const vet = vets.find(v => v.vet_id === req.vet_id);
          const vetName = vet ? vet.name : 'Unknown Vet';
          
          return `
        <div class="item-card">

          <div class="item-header">
            <div class="item-title">Booking #${shortId}</div>
            <span class="status-badge status-${req.status.toLowerCase()}">${req.status}</span>
          </div>

          <div class="item-details">
            <p><strong>Patient Name:</strong> ${req.name || "Unknown"}</p>
            <p><strong>Phone:</strong> ${req.phone || "N/A"}</p>
            <p><strong>Vet:</strong> Dr. ${vetName}</p>
            <p><strong>Date:</strong> ${req.date}</p>
            <p><strong>Time:</strong> ${req.time}</p>
            <p><strong>Notes:</strong> ${req.notes || "No notes"}</p>
          </div>

          <div class="action-buttons">
            <button class="btn-primary" onclick="updateAppointmentStatus('${req.appointment_id}', 'Approved')">✓ Accept</button>
            <button class="btn-danger" onclick="updateAppointmentStatus('${req.appointment_id}', 'Rejected')">✕ Reject</button>
          </div>


        </div>
      `;
        }
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
        (req) => {
          // Generate short request ID from adoption_id
          const shortId = req.request_id || generateShortId(req.adoption_id);
          
          // Find pet and shelter names
          const pet = pets.find(p => p.pet_id === req.pet_id);
          const shelter = shelters.find(s => s.shelter_id === req.shelter_id);
          
          const petName = pet ? pet.name : 'Unknown Pet';
          const shelterName = shelter ? shelter.shelter_name : 'Unknown Shelter';
          
          return `
      <div class="item-card">

        <div class="item-header">
          <div class="item-title">Request #${shortId}</div>
          <span class="status-badge status-${req.status.toLowerCase()}">${req.status}</span>
        </div>

        <div class="item-details">
          <p><strong>Applicant:</strong> ${req.name}</p>
          <p><strong>Email:</strong> ${req.email}</p>
          <p><strong>Phone:</strong> ${req.phone}</p>
          <p><strong>Pet Name:</strong> ${petName}</p>
          <p><strong>Shelter:</strong> ${shelterName}</p>
          <p><strong>Message:</strong> ${req.message || "No message"}</p>
        </div>
        <div class="action-buttons">
          <button class="btn-primary" onclick="updateAdoptionStatus('${req.adoption_id}', '${req.pet_id}', 'Approved')">✓ Accept</button>
          <button class="btn-danger" onclick="updateAdoptionStatus('${req.adoption_id}', '${req.pet_id}', 'Rejected')">✕ Reject</button>
        </div>

      </div>
      `;
        }
      )
      .join("") +
    "</div>";
}

// ---------- Adoption Status Update (FIXED) ----------
async function updateAdoptionStatus(adoption_id, pet_id, newStatus) {
  try {
    await apiClient.put("adminUpdateAdoptionStatus", {
      adoption_id,
      status: newStatus
    });

    // If accepted, hide the pet from display
    if (newStatus === 'Approved') {
      await apiClient.put("adminHidePet", {
        pet_id,
        hidden: true
      });
      
      // Remove pet from local array
      pets = pets.filter(p => p.pet_id !== pet_id);
    }

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

// ---------- Render Orders ----------
async function renderOrders() {
  const container = document.getElementById("orders-list");
  
  try {
    // Fetch all orders from Supabase
    const allOrders = await apiClient.get("adminGetAllOrders");
    orders = allOrders || [];
    
    document.getElementById("orders-count").textContent = orders.length;

    if (orders.length === 0) {
      container.innerHTML = `<p style="padding: 20px; text-align: center; color: #6b7280;">No orders found.</p>`;
      return;
    }

    container.innerHTML = '<div style="display: flex; flex-direction: column; gap: 15px;">' +
      orders
        .map((order) => `
          <div onclick="viewOrderDetail('${order.order_number}', '${order.email}')" style="cursor: pointer; display: flex; gap: 15px; padding: 15px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; transition: all 0.3s; align-items: center;">
            <div style="flex: 1;">
              <div style="font-weight: 600; color: #1f2937; margin-bottom: 8px;">Order #${order.order_number}</div>
              <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Customer: ${order.first_name} ${order.last_name}</div>
              <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Address: ${order.address}, ${order.city}</div>
              <div style="font-size: 14px; color: #6b7280;">Email: ${order.email}</div>
            </div>
            <div style="text-align: right; min-width: 150px;">
              <div style="font-weight: 600; color: #87da48; font-size: 16px; margin-bottom: 8px;">$${parseFloat(order.total_amount).toFixed(2)}</div>
              <span style="display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${getStatusColor(order.tracking_status)}; color: white;">
                ${order.tracking_status}
              </span>
            </div>
          </div>
        `)
        .join("") +
      "</div>";
  } catch (error) {
    console.error("Error loading orders:", error);
    container.innerHTML = `<p style="padding: 20px; color: #dc2626;">Error loading orders</p>`;
  }
}

function getStatusColor(status) {
  const colors = {
    'Order Placed': '#fbbf24',
    'Order Confirmed': '#60a5fa',
    'Out for Delivery': '#a78bfa',
    'Delivered': '#34d399'
  };
  return colors[status] || '#9ca3af';
}

function viewOrderDetail(orderNumber, email) {
  window.location.href = `admin-order-detail.html?order=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`;
}

window.viewOrderDetail = viewOrderDetail;

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

  // Calculate order stats from orders array
  orderStats.pending = orders.filter(o => o.tracking_status === 'Order Placed').length;
  orderStats.completed = orders.filter(o => o.tracking_status === 'Delivered').length;
  orderStats.cancelled = 0; // You can add cancelled status tracking if needed

  document.getElementById("pending-orders").textContent = orderStats.pending;
  document.getElementById("completed-orders").textContent = orderStats.completed;
  document.getElementById("cancelled-orders").textContent = orderStats.cancelled;
}

// ---------- Init ----------
(async function init() {
  await loadData();
  // Load orders separately
  try {
    const allOrders = await apiClient.get("adminGetAllOrders");
    orders = allOrders || [];
  } catch (error) {
    console.error("Error loading orders:", error);
  }
  updateDashboard();
})();
