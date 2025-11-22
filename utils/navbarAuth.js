// Navbar Authentication State Manager
// This script handles showing/hiding navbar items based on login status

// Function to update navbar based on auth state
function updateNavbar() {
  try {
    // Check if user is logged in via localStorage
    const sessionStr = localStorage.getItem('supabase.auth.session');
    const isAdmin = localStorage.getItem('isAdmin');
    
    // Parse session to check if it's valid
    let session = null;
    if (sessionStr) {
      try {
        session = JSON.parse(sessionStr);
        // Check if session has access_token and user
        if (!session.access_token || !session.user) {
          session = null;
        }
      } catch (e) {
        session = null;
      }
    }
    
    const isLoggedIn = !!(session || isAdmin === 'true');

    console.log('NavbarAuth: Checking login status...');
    console.log('Session exists:', !!sessionStr);
    console.log('Session valid:', !!session);
    console.log('IsAdmin:', isAdmin);
    console.log('IsLoggedIn:', isLoggedIn);

    // Get the dropdown menu
    const userDropdownMenu = document.querySelector('.user-dropdown-menu');
    
    if (!userDropdownMenu) {
      console.error('NavbarAuth: User dropdown menu not found!');
      return;
    }

    console.log('NavbarAuth: Dropdown menu found, updating...');

    // Clear existing menu items
    userDropdownMenu.innerHTML = '';

    if (isLoggedIn) {
      console.log('NavbarAuth: User is logged in - showing Account & Sign Out');
      // User is logged in - show Account and Sign Out
      userDropdownMenu.innerHTML = `
        <li><a href="../Accounts/Accountpage.html">Account</a></li>
        <li><a href="#" id="signOutBtn" style="color: #ef4444;">Sign Out</a></li>
      `;

      // Add sign out functionality
      const signOutBtn = document.getElementById('signOutBtn');
      if (signOutBtn) {
        signOutBtn.addEventListener('click', handleSignOut);
      }
    } else {
      console.log('NavbarAuth: User is logged out - showing Login & Signup');
      // User is logged out - show Login and Signup
      userDropdownMenu.innerHTML = `
        <li><a href="../Authentication/login.html">Login</a></li>
        <li><a href="../Authentication/register.html">Signup</a></li>
      `;
    }

    console.log('NavbarAuth: Update complete!');
  } catch (error) {
    console.error('NavbarAuth: Error updating navbar:', error);
  }
}

// Function to handle sign out with custom modal
function handleSignOut(event) {
  event.preventDefault();

  // Create custom logout modal
  const existingModal = document.getElementById('navbar-logout-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'navbar-logout-modal';
  modal.style.cssText = `
    display: flex;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  `;

  modal.innerHTML = `
    <div style="
      background-color: white;
      padding: 30px;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      animation: slideUp 0.3s ease;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    ">
      <div style="
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        background-color: #fee2e2;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg style="width: 40px; height: 40px; color: #dc2626;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
      </div>
      <h3 style="font-size: 1.3rem; margin-bottom: 15px; color: #333;">Confirm Logout</h3>
      <p style="color: #666; margin-bottom: 25px;">Are you sure you want to sign out of your account?</p>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button id="modal-cancel-btn" style="
          padding: 12px 24px;
          border: 2px solid #7ED957;
          background: transparent;
          color: #7ED957;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
        ">Cancel</button>
        <button id="modal-confirm-btn" style="
          padding: 12px 24px;
          border: 2px solid #dc2626;
          background: transparent;
          color: #dc2626;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
        ">Sign Out</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    #modal-cancel-btn:hover {
      background-color: #7ED957;
      color: white;
      transform: translateY(-2px);
    }
    #modal-confirm-btn:hover {
      background-color: #dc2626;
      color: white;
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(style);

  // Handle cancel
  document.getElementById('modal-cancel-btn').addEventListener('click', () => {
    modal.remove();
    style.remove();
  });

  // Handle confirm
  document.getElementById('modal-confirm-btn').addEventListener('click', () => {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();

    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background-color: #7ED957;
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      font-family: inherit;
    `;
    toast.textContent = 'Logged out successfully!';
    
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(400px); }
        to { transform: translateX(0); }
      }
    `;
    document.head.appendChild(toastStyle);
    document.body.appendChild(toast);

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = '../Homepage/homepage.html';
    }, 1000);
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      style.remove();
    }
  });
}

// Initialize navbar on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('NavbarAuth: Initializing...');
  updateNavbar();
});
