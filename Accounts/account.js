import { apiClient } from "../utils/apiClient.js";

// ===============================
// REDIRECT IF USER NOT LOGGED IN
// ===============================
(async () => {
  const user = apiClient.getUser();

  if (!user) {
    window.location.href = "../Authentication/login.html";
  }
})();
  
// ===============================
// LOGOUT
// ===============================
document.getElementById("logout-btn").addEventListener("click", async () => {
  try {
    await apiClient.post("authSignOut");
    apiClient.setAuthSession(null);
    showToast("Logged out successfully!", "success");

    setTimeout(() => {
      window.location.href = "../Authentication/login.html";
    }, 1000);
  } catch (error) {
    showToast(error.message || "Logout failed!", "error");
  }
});

// ===============================
// LOAD USER PROFILE
// ===============================
document.addEventListener("DOMContentLoaded", async () => {

  const fullNameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  const editBtn = document.getElementById("edit-profile-btn");
  const saveBtn = document.querySelector("#edit-actions .btn-primary");
  const cancelBtn = document.querySelector("#edit-actions .btn-secondary");
  const editActions = document.getElementById("edit-actions");

  // GET AUTH USER
  const user = apiClient.getUser();
  if (!user) return;

  // FETCH FROM custom `user` TABLE
  try {
    const profile = await apiClient.get("getUserProfile");

    if (!profile) {
      console.error("Profile not found");
      return;
    }

    let firstName = profile.first_name;
    let lastName = profile.last_name;
    let emailValue = profile.email;
    let phoneValue = profile.phone_no || "";

    // SET INPUT VALUES
    fullNameInput.value = `${firstName} ${lastName}`.trim();
    emailInput.value = emailValue;
    phoneInput.value = phoneValue;

    // ===============================
    // ENABLE EDIT MODE
    // ===============================
    function toggleEditMode() {
      fullNameInput.disabled = false;
      emailInput.disabled = false;
      phoneInput.disabled = false;

      editBtn.style.display = "none";
      editActions.classList.remove("hidden");
    }

    // ===============================
    // CANCEL EDIT MODE
    // ===============================
    function cancelEdit() {
      fullNameInput.value = `${firstName} ${lastName}`.trim();
      emailInput.value = emailValue;
      phoneInput.value = phoneValue;

      fullNameInput.disabled = true;
      emailInput.disabled = true;
      phoneInput.disabled = true;

      editActions.classList.add("hidden");
      editBtn.style.display = "inline-flex";
    }

    // ===============================
    // SAVE PROFILE
    // ===============================
    async function saveProfile() {
      const fullName = fullNameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();

      if (!fullName || !email) {
        alert("Full name and email are required.");
        return;
      }

      const nameParts = fullName.split(" ");
      const updatedFirst = nameParts[0];
      const updatedLast = nameParts.slice(1).join(" ");

      try {
        await apiClient.put("updateUserProfile", {
          first_name: updatedFirst,
          last_name: updatedLast,
          email,
          phone_no: phone
        });

        // Update local values
        firstName = updatedFirst;
        lastName = updatedLast;
        emailValue = email;
        phoneValue = phone;

        cancelEdit();
        showToast("Profile updated!", "success");
      } catch (updateErr) {
        alert("Failed to update profile.");
        console.error(updateErr);
      }
    }

    // Add event listeners
    editBtn.addEventListener("click", toggleEditMode);
    cancelBtn.addEventListener("click", cancelEdit);
    saveBtn.addEventListener("click", saveProfile);
  } catch (err) {
    console.error("Error loading profile:", err);
  }

  // Add event listeners
  editBtn.addEventListener("click", toggleEditMode);
  cancelBtn.addEventListener("click", cancelEdit);
  saveBtn.addEventListener("click", saveProfile);
});

// ===============================
// TOAST FUNCTION
// ===============================
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast ${type} active`;

  setTimeout(() => {
    toast.classList.remove("active");
  }, 3000);
}

// ===============================
// TAB SWITCHING FUNCTION
// ===============================
function switchTab(tabName) {
  // Remove active class from all tab buttons
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // Remove active class from all tab contents
  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.remove("active");
  });

  // Add active class to selected tab button
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    if (btn.getAttribute("onclick")?.includes(`'${tabName}'`)) {
      btn.classList.add("active");
    }
  });

  // Add active class to selected tab content
  const selectedTab = document.getElementById(`${tabName}-tab`);
  if (selectedTab) {
    selectedTab.classList.add("active");
  }
}

// Make switchTab available globally
window.switchTab = switchTab;


            // Render Orders
            function renderOrders() {
                const orderList = document.getElementById('order-list');
                orderList.innerHTML = orders.map(order => `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <h3>Order ${order.id}</h3>
                                <p style="color: #666; margin-top: 5px;">Placed on ${order.date}</p>
                            </div>
                            <span class="status-badge status-${order.status.toLowerCase().replace(' ', '-')}">
                                ${order.status}
                            </span>
                        </div>
                        <div class="order-details">
                            <div class="order-info">
                                <div>
                                    <p style="color: #666;">Total Amount</p>
                                    <p class="price">Rs. ${order.total.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p style="color: #666;">Items</p>
                                    <p style="font-weight: 500;">${order.items} items</p>
                                </div>
                                <div style="text-align: right;">
                                    <button class="btn btn-secondary" onclick="viewOrderDetails('${order.id}')">
                                        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                        View Details
                                    </button>
                                </div>
                            </div>
                            <div class="order-products">
                                <p style="color: #666; margin-bottom: 10px;">Products:</p>
                                <ul>
                                    ${order.products.map(product => `<li>${product}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            function viewOrderDetails(orderId) {
                showToast('Opening order details...', 'success');
            }

            // Render Addresses
            function renderAddresses() {
                const addressList = document.getElementById('address-list');
                addressList.innerHTML = addresses.map(address => `
                    <div class="address-card ${address.isDefault ? 'default' : ''}">
                        ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
                        <div style="margin-bottom: 15px;">
                            <h3>${address.type}</h3>
                            <p style="color: #333; margin-top: 5px;">${address.name}</p>
                        </div>
                        <div style="color: #666; line-height: 1.8;">
                            <p>${address.address}</p>
                            <p>${address.city}</p>
                            <p>${address.phone}</p>
                        </div>
                        <div class="address-actions">
                            <button class="btn btn-secondary" style="flex: 1;" onclick="editAddress(${address.id})">
                                Edit
                            </button>
                            <button class="btn btn-delete" onclick="openDeleteModal('address', ${address.id})">
                                Delete
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            function editAddress(id) {
                showToast('Edit address functionality', 'success');
            }

            

            function addToCart(id) {
                showToast('Added to cart!', 'success');
            }

            // Close modals when clicking outside
            window.onclick = function(event) {
                if (event.target.classList.contains('modal')) {
                    event.target.classList.remove('active');
                }
            }
            // Initialize
            renderOrders();
            renderAddresses();