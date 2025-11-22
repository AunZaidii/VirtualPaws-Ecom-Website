import { apiClient } from "../utils/apiClient.js";

// Admin credentials
const ADMIN_EMAIL = "admin@virtualpaws.com";
const ADMIN_PASSWORD = "virtualpaws123";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  const loginBtn = document.querySelector(".login-btn");
  const loginMessage = document.querySelector(".login-message");

  // LOGIN FUNCTION
  loginBtn.addEventListener("click", async () => {
    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();

    if (!email || !password) {
      loginMessage.textContent = "Please enter email and password.";
      loginMessage.style.color = "red";
      return;
    }

    // Check if admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      loginMessage.textContent = "Admin login successful!";
      loginMessage.style.color = "green";
      
      // Set admin flag in localStorage
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', email);
      
      setTimeout(() => {
        window.location.href = "../Admin_Panel/Admin.html";
      }, 1200);
      return;
    }

    loginMessage.textContent = "Signing in...";
    loginMessage.style.color = "#333";

    try {
      const data = await apiClient.post("authLogin", { email, password });

      if (data.access_token) {
        apiClient.setAuthSession(data);
      }

      // Clear admin flag for regular users
      localStorage.removeItem('isAdmin');

      loginMessage.textContent = "Login successful!";
      loginMessage.style.color = "green";

      setTimeout(() => {
        window.location.href = "../Homepage/homepage.html";
      }, 1200);

    } catch (err) {
      console.error(err);
      loginMessage.textContent = err.message || "Unexpected error. Try again.";
      loginMessage.style.color = "red";
    }
  });

  // PASSWORD SHOW/HIDE
  const togglePassword = document.querySelector(".toggle-password");
  const passwordField = form.querySelector('input[name="password"]');

  togglePassword.addEventListener("click", () => {
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });

  // RESET PASSWORD
  const forgotLink = document.getElementById("forgotPasswordLink");
  const resetSection = document.getElementById("resetSection");
  const sendResetEmail = document.getElementById("sendResetEmail");
  const resetEmail = document.getElementById("resetEmail");
  const resetMessage = document.getElementById("resetMessage");

  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    resetSection.style.display = "block";
  });

  sendResetEmail.addEventListener("click", async () => {
    const email = resetEmail.value.trim();
    if (!email) {
      resetMessage.textContent = "Enter your email!";
      resetMessage.style.color = "red";
      return;
    }

    const redirectURL = `${window.location.origin}/Authentication/reset-password.html`;

    try {
      await apiClient.post("authResetPassword", {
        email,
        redirectTo: redirectURL,
      });

      resetMessage.textContent = "Reset email sent!";
      resetMessage.style.color = "green";
    } catch (err) {
      resetMessage.textContent = err.message || "Error sending reset email";
      resetMessage.style.color = "red";
    }
  });
});
