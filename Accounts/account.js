const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

let supabaseClient;

document.getElementById("logout-btn").addEventListener("click", async () => {
    if (!supabaseClient) return;

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout failed:", error);
        showToast("Logout failed!", "error");
    } else {
        showToast("Logged out successfully!", "success");
        setTimeout(() => {
            window.location.href = "../Authentication/login.html"; // Redirect after logout
        }, 1000);
    }
});


if (typeof supabase !== "undefined") {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error("Supabase library not loaded!");
}

let firstName = "";
let lastName = "";
let emailValue = "";
let phoneValue = "";

document.addEventListener("DOMContentLoaded", async () => {
  if (!supabaseClient) return;

  // DOM Elements
  const fullNameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  const editBtn = document.getElementById("edit-profile-btn");
  const editActions = document.getElementById("edit-actions");
  const saveBtn = editActions.querySelector(".btn-primary");
  const cancelBtn = editActions.querySelector(".btn-secondary");

  // Get authenticated user
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    let userId = null;
    if (authError || !user) {
        console.log("User not logged in. Showing empty account info.");
    } else {
        userId = user.id;
    }

  // Fetch profile from table editor's user table
  const { data: userData, error: userError } = await supabaseClient
    .from("user")
    .select("first_name, last_name, email, phone_no")
    .eq("user_id", userId)
    .single();

  if (userError || !userData) {
    console.error("Failed to fetch user data:", userError);
    return;
  }

  // Store initial values
  firstName = userData.first_name;
  lastName = userData.last_name;
  emailValue = userData.email;
  phoneValue = userData.phone_no || "";

  // Fill inputs
  fullNameInput.value = `${firstName} ${lastName}`;
  emailInput.value = emailValue;
  phoneInput.value = phoneValue;

  // --- Enable Editing ---
  function toggleEditMode() {
    fullNameInput.disabled = false;
    emailInput.disabled = false;
    phoneInput.disabled = false;

    editBtn.style.display = "none";
    editActions.classList.remove("hidden");
  }

  // --- Cancel Editing ---
  function cancelEdit() {
    fullNameInput.value = `${firstName} ${lastName}`;
    emailInput.value = emailValue;
    phoneInput.value = phoneValue;

    fullNameInput.disabled = true;
    emailInput.disabled = true;
    phoneInput.disabled = true;

    editActions.classList.add("hidden");
    editBtn.style.display = "inline-flex";
  }

  // --- Save Changes ---
  async function saveProfile() {
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!fullName || !email || !phone) {
      alert("Name, email, and phone number cannot be empty.");
      return;
    }

    const nameParts = fullName.split(" ");
    const newFirstName = nameParts[0];
    const newLastName = nameParts.slice(1).join(" ") || "";

    console.log("Updating user:", {
      first_name: newFirstName,
      last_name: newLastName,
      email: email,
      phone_no: phone
    });

    const { error: userTableError } = await supabaseClient
      .from("user")
      .update({
        first_name: newFirstName,
        last_name: newLastName,
        email: email,
        phone_no: phone
      })
      .eq("user_id", userId);

    if (userTableError) {
      console.error("Update failed:", userTableError);
      alert("Failed to update profile.");
      return;
    }

    firstName = newFirstName;
    lastName = newLastName;
    emailValue = email;
    phoneValue = phone;

    fullNameInput.disabled = true;
    emailInput.disabled = true;
    phoneInput.disabled = true;

    editActions.classList.add("hidden");
    editBtn.style.display = "inline-flex";
}


  editBtn.addEventListener("click", toggleEditMode);
  saveBtn.addEventListener("click", saveProfile);
  cancelBtn.addEventListener("click", cancelEdit);
});

 // Data
            const orders = [
                {
                    id: "ORD-2024-001",
                    date: "November 5, 2025",
                    status: "Delivered",
                    total: 4500,
                    items: 3,
                    products: ["Premium Dog Food 5kg", "Cat Toy Set", "Pet Shampoo"]
                },
                {
                    id: "ORD-2024-002",
                    date: "October 28, 2025",
                    status: "Delivered",
                    total: 2800,
                    items: 2,
                    products: ["Bird Cage", "Bird Food Mix"]
                },
                {
                    id: "ORD-2024-003",
                    date: "October 15, 2025",
                    status: "In Transit",
                    total: 3200,
                    items: 1,
                    products: ["Automatic Pet Feeder"]
                },
                {
                    id: "ORD-2024-004",
                    date: "September 30, 2025",
                    status: "Delivered",
                    total: 5600,
                    items: 4,
                    products: ["Dog Bed Large", "Chew Toys Pack", "Leash & Collar Set", "Training Treats"]
                }
            ];

            let addresses = [
                {
                    id: 1,
                    type: "Home",
                    name: "John Doe",
                    address: "123 Main Street, Block A",
                    city: "Karachi, Pakistan - 75500",
                    phone: "(+92) 300-1234567",
                    isDefault: true
                },
                {
                    id: 2,
                    type: "Office",
                    name: "John Doe",
                    address: "456 Business Avenue, Floor 3",
                    city: "Karachi, Pakistan - 74000",
                    phone: "(+92) 300-1234567",
                    isDefault: false
                }
            ];


            let deleteTarget = null;

            // Tab Switching
            function switchTab(tabName) {
                // Remove active class from all tabs and buttons
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                });
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Add active class to selected tab
                document.getElementById(`${tabName}-tab`).classList.add('active');
                event.target.closest('.tab-btn').classList.add('active');
            }

            // Profile Edit Mode
            function toggleEditMode() {
                const inputs = document.querySelectorAll('#profile-form input:not([type="text"][disabled][value="January 2024"])');
                const editActions = document.getElementById('edit-actions');
                const editBtn = document.getElementById('edit-profile-btn');

                inputs.forEach(input => {
                    if (input.disabled && input.value !== "January 2024") {
                        input.disabled = false;
                        input.style.borderColor = '#7ED957';
                    }
                });

                editActions.classList.remove('hidden');
                editBtn.style.display = 'none';
            }

            function saveProfile() {
                showToast('Profile updated successfully!', 'success');
                cancelEdit();
            }

            function cancelEdit() {
                const inputs = document.querySelectorAll('#profile-form input');
                const editActions = document.getElementById('edit-actions');
                const editBtn = document.getElementById('edit-profile-btn');

                inputs.forEach(input => {
                    if (input.value !== "January 2024") {
                        input.disabled = true;
                        input.style.borderColor = '#e5e5e5';
                    }
                });

                editActions.classList.add('hidden');
                editBtn.style.display = 'inline-flex';
            }

            // Password Modal
            function openPasswordModal() {
                document.getElementById('password-modal').classList.add('active');
            }

            function closePasswordModal() {
                document.getElementById('password-modal').classList.remove('active');
                document.getElementById('password-form').reset();
            }

            document.getElementById('password-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const newPassword = document.getElementById('new-password').value;
                const confirmPassword = document.getElementById('confirm-password').value;

                if (newPassword !== confirmPassword) {
                    showToast('Passwords do not match!', 'error');
                    return;
                }

                showToast('Password updated successfully!', 'success');
                closePasswordModal();
            });

            // Address Modal
            function openAddressModal() {
                document.getElementById('address-modal').classList.add('active');
            }

            function closeAddressModal() {
                document.getElementById('address-modal').classList.remove('active');
                document.getElementById('address-form').reset();
            }

            document.getElementById('address-form').addEventListener('submit', function(e) {
                e.preventDefault();
                showToast('Address added successfully!', 'success');
                closeAddressModal();
            });

            // Delete Modal
            function openDeleteModal(type, id) {
                deleteTarget = { type, id };
                document.getElementById('delete-modal').classList.add('active');
            }

            function closeDeleteModal() {
                deleteTarget = null;
                document.getElementById('delete-modal').classList.remove('active');
            }


            // Toast Notification
            function showToast(message, type = 'success') {
                const toast = document.getElementById('toast');
                toast.textContent = message;
                toast.className = `toast ${type} active`;
                
                setTimeout(() => {
                    toast.classList.remove('active');
                }, 3000);
            }

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