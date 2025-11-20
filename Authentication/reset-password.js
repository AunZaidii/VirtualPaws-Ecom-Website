import { apiClient } from "../utils/apiClient.js";

const form = document.getElementById("resetForm");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");

// Toggle password visibility
togglePassword.addEventListener("click", () => {
  const type =
    confirmPassword.getAttribute("type") === "password" ? "text" : "password";
  confirmPassword.setAttribute("type", type);
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
});

// Handle password reset
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = newPassword.value.trim();
  const confirm = confirmPassword.value.trim();

  if (password.length < 8) {
    message.style.color = "red";
    message.textContent = "Password must be at least 8 characters.";
    return;
  }

  if (password !== confirm) {
    message.style.color = "red";
    message.textContent = "Passwords do not match!";
    return;
  }

  try {
    await apiClient.put("authResetPassword", { password });

    message.style.color = "green";
    message.textContent = "Password updated successfully! Redirecting...";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (err) {
    console.error("Error resetting password:", err);
    message.style.color = "red";
    message.textContent = err.message || "Failed to reset password. Try again.";
  }
});
