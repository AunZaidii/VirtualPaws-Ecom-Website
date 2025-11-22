import { apiClient } from "../utils/apiClient.js";
import { supabase, getCurrentSession, getCurrentUser } from "../utils/supabaseClient.js";

// ===============================
// HANDLE GOOGLE OAUTH CALLBACK & SESSION
// ===============================
(async () => {
  // Check for OAuth callback (hash in URL after Google redirect)
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  if (hashParams.has('access_token')) {
    console.log('OAuth callback detected, processing session...');
  }

  // Get current session from Supabase
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Session error:', error);
  }

  if (session) {
    // Store session in localStorage for apiClient compatibility
    apiClient.setAuthSession(session);
    console.log('Session stored:', session.user.email);

    // Check if user exists in custom user table, if not create one
    try {
      const profile = await apiClient.get("getUserProfile");
      if (!profile) {
        // Create user profile for Google users
        const user = session.user;
        const nameParts = (user.user_metadata?.full_name || user.email).split(' ');
        await apiClient.post("authSignUp", {
          email: user.email,
          password: null, // Google auth users don't need password
          first_name: nameParts[0] || 'User',
          last_name: nameParts.slice(1).join(' ') || '',
          phone_no: user.user_metadata?.phone || ''
        });
      }
    } catch (err) {
      console.log('Profile check/creation:', err.message);
    }

    // Clean up URL hash
    if (window.location.hash) {
      history.replaceState(null, null, window.location.pathname);
    }
  } else {
    // No session found, redirect to login
    window.location.href = "../Authentication/login.html";
  }
})();

// ===============================
// GLOBAL VARIABLES
// ===============================
let currentUserProfile = null;
  
// ===============================
// LOGOUT WITH CUSTOM MODAL
// ===============================
const logoutModal = document.getElementById("logout-modal");
const logoutBtn = document.getElementById("logout-btn");
const confirmLogoutBtn = document.getElementById("confirm-logout-btn");
const cancelLogoutBtn = document.getElementById("cancel-logout-btn");

// Show logout modal
logoutBtn.addEventListener("click", () => {
  logoutModal.classList.add("active");
});

// Cancel logout
cancelLogoutBtn.addEventListener("click", () => {
  logoutModal.classList.remove("active");
});

// Confirm logout
confirmLogoutBtn.addEventListener("click", async () => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear local storage
    apiClient.setAuthSession(null);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    
    showToast("Logged out successfully!", "success");

    setTimeout(() => {
      window.location.href = "../Authentication/login.html";
    }, 1000);
  } catch (error) {
    console.error('Logout error:', error);
    showToast(error.message || "Logout failed!", "error");
  }
});

// Close modal on outside click
window.addEventListener("click", (event) => {
  if (event.target === logoutModal) {
    logoutModal.classList.remove("active");
  }
});

// ===============================
// LOAD USER PROFILE
// ===============================
document.addEventListener("DOMContentLoaded", async () => {

  const fullNameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");

  const editBtn = document.getElementById("edit-profile-btn");
  const saveBtn = document.querySelector("#edit-actions .btn-primary");
  const cancelBtn = document.querySelector("#edit-actions .btn-secondary");
  const editActions = document.getElementById("edit-actions");

  // GET AUTH USER
  const user = apiClient.getUser();
  if (!user) return;

  // Display Google profile picture if available
  const session = apiClient.getSession();
  if (session && session.user) {
    const avatarUrl = session.user.user_metadata?.avatar_url || 
                      session.user.user_metadata?.picture;
    const fullName = session.user.user_metadata?.full_name;
    
    if (avatarUrl) {
      // Update profile picture in navbar if exists
      const navbarAvatar = document.querySelector('.user-dropdown img, .nav-items-logo .fa-user');
      if (navbarAvatar && navbarAvatar.tagName === 'I') {
        // Replace icon with image
        const img = document.createElement('img');
        img.src = avatarUrl;
        img.alt = 'Profile';
        img.style.cssText = 'width: 24px; height: 24px; border-radius: 50%; object-fit: cover;';
        navbarAvatar.replaceWith(img);
      }
      
      // Update profile picture on account page if profile image container exists
      const profileImg = document.querySelector('.profile-picture, .account-avatar');
      if (profileImg) {
        if (profileImg.tagName === 'IMG') {
          profileImg.src = avatarUrl;
        } else {
          profileImg.style.backgroundImage = `url(${avatarUrl})`;
        }
      }
    }
  }

  // FETCH FROM custom `user` TABLE
  try {
    const profile = await apiClient.get("getUserProfile");

    if (!profile) {
      console.error("Profile not found");
      return;
    }

    currentUserProfile = profile;
    let firstName = profile.first_name;
    let lastName = profile.last_name;
    let emailValue = profile.email;
    let phoneValue = profile.phone_no || "";
    let addressValue = profile.address || "";

    // SET INPUT VALUES
    fullNameInput.value = `${firstName} ${lastName}`.trim();
    emailInput.value = emailValue;
    phoneInput.value = phoneValue;
    addressInput.value = addressValue;

    // ===============================
    // ENABLE EDIT MODE
    // ===============================
    window.toggleEditMode = function() {
      fullNameInput.disabled = false;
      // Email should NEVER be editable
      emailInput.disabled = true;
      phoneInput.disabled = false;
      addressInput.disabled = false;

      editBtn.style.display = "none";
      editActions.classList.remove("hidden");
    };

    // ===============================
    // CANCEL EDIT MODE
    // ===============================
    window.cancelEdit = function() {
      fullNameInput.value = `${firstName} ${lastName}`.trim();
      emailInput.value = emailValue;
      phoneInput.value = phoneValue;
      addressInput.value = addressValue;

      fullNameInput.disabled = true;
      emailInput.disabled = true;
      phoneInput.disabled = true;
      addressInput.disabled = true;

      editActions.classList.add("hidden");
      editBtn.style.display = "inline-flex";
    };

    // ===============================
    // SAVE PROFILE
    // ===============================
    window.saveProfile = async function() {
      const fullName = fullNameInput.value.trim();
      const phone = phoneInput.value.trim();
      const address = addressInput.value.trim();

      if (!fullName) {
        showToast("Full name is required.", "error");
        return;
      }

      const nameParts = fullName.split(" ");
      const updatedFirst = nameParts[0];
      const updatedLast = nameParts.slice(1).join(" ");

      try {
        await apiClient.put("updateUserProfile", {
          first_name: updatedFirst,
          last_name: updatedLast,
          phone_no: phone,
          address: address
        });

        // Update local values
        firstName = updatedFirst;
        lastName = updatedLast;
        phoneValue = phone;
        addressValue = address;
        currentUserProfile.address = address;

        cancelEdit();
        showToast("Profile updated!", "success");
      } catch (updateErr) {
        showToast("Failed to update profile.", "error");
        console.error(updateErr);
      }
    };

    // Load all histories
    await loadOrderHistory();
    await loadAdoptionHistory();
    await loadAppointmentHistory();
  } catch (err) {
    console.error("Error loading profile:", err);
  }
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

// ===============================
// LOAD ORDER HISTORY
// ===============================
async function loadOrderHistory() {
  try {
    const orders = await apiClient.get("getUserOrders");
    const orderList = document.getElementById('order-list');

    if (!orders || orders.length === 0) {
      orderList.innerHTML = `
        <div class="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders yet.</p>
        </div>
      `;
      return;
    }

    orderList.innerHTML = orders.map(order => {
      const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const items = Array.isArray(order.items) ? order.items : [];
      const itemCount = items.reduce((sum, p) => sum + (p.quantity || 1), 0);

      return `
        <div class="order-card">
          <div class="order-header">
            <div>
              <h3>Order #${order.order_number || order.order_id.substring(0, 8)}</h3>
              <p style="color: #666; margin-top: 5px;">Placed on ${orderDate}</p>
            </div>
            <span class="status-badge status-${(order.tracking_status || order.order_status || 'pending').toLowerCase().replace(' ', '-')}">
              ${order.tracking_status || order.order_status || 'Pending'}
            </span>
          </div>
          <div class="order-details">
            <div class="order-info">
              <div>
                <p style="color: #666;">Total Amount</p>
                <p class="price">$${parseFloat(order.total_amount || 0).toFixed(2)}</p>
              </div>
              <div>
                <p style="color: #666;">Items</p>
                <p style="font-weight: 500;">${itemCount} items</p>
              </div>
              <div style="text-align: right;">
                <button class="btn btn-secondary" onclick="window.location.href='../track-order/track-order.html?order_id=${order.order_id}'">
                  Track Order
                </button>
              </div>
            </div>
            ${items.length > 0 ? `
              <div class="order-products">
                <p style="color: #666; margin-bottom: 10px;">Products:</p>
                <ul>
                  ${items.map(p => `<li>${p.title || p.name} x ${p.quantity || 1}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error("Error loading orders:", error);
    showToast("Failed to load order history", "error");
  }
}

// ===============================
// LOAD ADOPTION HISTORY
// ===============================
async function loadAdoptionHistory() {
  try {
    const adoptions = await apiClient.get("getUserAdoptions");
    const adoptionList = document.getElementById('adoption-list');

    if (!adoptions || adoptions.length === 0) {
      adoptionList.innerHTML = `
        <div class="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          <h3>No Adoption Requests</h3>
          <p>You haven't submitted any adoption requests yet.</p>
        </div>
      `;
      return;
    }

    adoptionList.innerHTML = adoptions.map(adoption => {
      const adoptionDate = new Date(adoption.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const pet = adoption.pets || {};
      const petImage = pet.image1 || '../Homepage/product images/placeholder-pet.jpg';

      return `
        <div class="adoption-card">
          <img src="${petImage}" alt="${pet.name}" class="adoption-image" onerror="this.src='../Homepage/product images/placeholder-pet.jpg'">
          <div class="adoption-info">
            <div class="adoption-header">
              <div>
                <h3>${pet.name || 'Pet'} - ${pet.breed || 'Unknown Breed'}</h3>
                <p style="color: #666; margin-top: 5px;">Requested on ${adoptionDate}</p>
              </div>
              <span class="status-badge status-${(adoption.status || 'pending').toLowerCase()}">
                ${adoption.status || 'Pending'}
              </span>
            </div>
            <div class="adoption-details">
              <div>
                <p style="color: #666;">Pet Age</p>
                <p style="font-weight: 500;">${pet.age || 'Unknown'}</p>
              </div>
              <div>
                <p style="color: #666;">Gender</p>
                <p style="font-weight: 500;">${pet.gender || 'Unknown'}</p>
              </div>
              <div>
                <p style="color: #666;">Contact</p>
                <p style="font-weight: 500;">${adoption.phone || 'N/A'}</p>
              </div>
            </div>
            ${adoption.message ? `
              <div style="margin-top: 15px; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 5px;">Your Message:</p>
                <p style="color: #333;">${adoption.message}</p>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error("Error loading adoptions:", error);
    showToast("Failed to load adoption history", "error");
  }
}

// ===============================
// LOAD APPOINTMENT HISTORY
// ===============================
async function loadAppointmentHistory() {
  try {
    const appointments = await apiClient.get("getUserAppointments");
    const appointmentList = document.getElementById('appointment-list');

    if (!appointments || appointments.length === 0) {
      appointmentList.innerHTML = `
        <div class="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h3>No Vet Appointments</h3>
          <p>You haven't booked any vet appointments yet.</p>
        </div>
      `;
      return;
    }

    appointmentList.innerHTML = appointments.map(appointment => {
      const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const vet = appointment.vet || {};
      const vetImage = vet.image_url || vet.profile_image || vet.image || '../Homepage/Logo/virtualpaws-logo.png';
      const vetName = vet.name || vet.vet_name || 'Veterinarian';
      const vetSpec = vet.specialization || vet.specialty || 'Veterinarian';
      const vetClinic = vet.clinic || vet.clinic_name || '';

      return `
        <div class="appointment-card">
          <div class="appointment-header">
            <div>
              <h3>Appointment with Dr. ${vetName}</h3>
              <p style="color: #666; margin-top: 5px;">${appointmentDate} at ${appointment.time}</p>
            </div>
            <span class="status-badge status-${(appointment.status || 'pending').toLowerCase()}">
              ${appointment.status || 'Pending'}
            </span>
          </div>
          
          <div class="appointment-vet-info">
            <img src="${vetImage}" alt="Dr. ${vetName}" class="vet-profile-img" onerror="this.src='../Homepage/Logo/virtualpaws-logo.png'">
            <div>
              <h4 style="margin-bottom: 5px;">Dr. ${vetName}</h4>
              <p style="color: #666; font-size: 0.9rem;">${vetSpec}</p>
              <p style="color: #666; font-size: 0.9rem;">${vetClinic}</p>
            </div>
          </div>

          <div class="appointment-details">
            <div>
              <p style="color: #666;">Contact Name</p>
              <p style="font-weight: 500;">${appointment.name || 'N/A'}</p>
            </div>
            <div>
              <p style="color: #666;">Phone</p>
              <p style="font-weight: 500;">${appointment.phone || 'N/A'}</p>
            </div>
          </div>

          ${appointment.notes ? `
            <div style="margin-top: 15px; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
              <p style="color: #666; font-size: 0.9rem; margin-bottom: 5px;">Notes:</p>
              <p style="color: #333;">${appointment.notes}</p>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error("Error loading appointments:", error);
    showToast("Failed to load appointment history", "error");
  }
}