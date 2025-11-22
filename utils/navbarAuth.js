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

// Function to handle sign out with confirmation
function handleSignOut(event) {
  event.preventDefault();

  // Show confirmation dialog
  const confirmSignOut = confirm('Are you sure you want to sign out?');
  
  if (confirmSignOut) {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();

    // Show success message
    alert('Successfully signed out!');

    // Redirect to homepage
    window.location.href = '../Homepage/homepage.html';
  }
}

// Initialize navbar on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('NavbarAuth: Initializing...');
  updateNavbar();
});
