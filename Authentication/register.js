import { apiClient } from "../utils/apiClient.js";
import { supabase } from "../utils/supabaseClient.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  const registerBtn = document.querySelector(".login-btn");
  const googleSignupBtn = document.getElementById("google-signup-btn");

  const message = document.createElement("p");
  message.classList.add("register-message");
  message.style.marginTop = "1vw";
  form.appendChild(message);

  // REGISTER BUTTON CLICK
  registerBtn.addEventListener("click", async () => {

    const firstName = form.querySelector('input[name="first_name"]').value.trim();
    const lastName = form.querySelector('input[name="last_name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();

    message.textContent = "";
    message.style.color = "#333";

    // VALIDATION
    if (!firstName || !lastName) {
      message.textContent = "Please enter first and last name!";
      message.style.color = "red";
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      message.textContent = "Please enter a valid email!";
      message.style.color = "red";
      return;
    }

    if (password.length < 8) {
      message.textContent = "Password must be at least 8 characters!";
      message.style.color = "red";
      return;
    }

    message.textContent = "Creating account...";

    try {
      const data = await apiClient.post("authRegister", {
        email,
        password,
        firstName,
        lastName
      });

      if (data.access_token) {
        apiClient.setAuthSession(data);
      }

      message.textContent = "Account created successfully!";
      message.style.color = "green";

      form.reset();

      setTimeout(() => {
        window.location.href = "./login.html";
      }, 2000);

    } catch (err) {
      console.error(err);
      message.textContent = err.message || "Unexpected error occurred.";
      message.style.color = "red";
    }
  });

  // GOOGLE SIGNUP
  googleSignupBtn.addEventListener("click", async () => {
    try {
      message.textContent = "Redirecting to Google...";
      message.style.color = "#333";

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/Accounts/Accountpage.html`
        }
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Google signup error:', err);
      message.textContent = err.message || "Google signup failed. Try again.";
      message.style.color = "red";
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
});
