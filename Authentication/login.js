import { supabaseClient } from "../SupabaseClient/supabaseClient.js";

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

    loginMessage.textContent = "Signing in...";
    loginMessage.style.color = "#333";

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        loginMessage.textContent = error.message;
        loginMessage.style.color = "red";
        return;
      }

      loginMessage.textContent = "Login successful!";
      loginMessage.style.color = "green";

      setTimeout(() => {
        window.location.href = "../Homepage/homepage.html";
      }, 1200);

    } catch (err) {
      console.error(err);
      loginMessage.textContent = "Unexpected error. Try again.";
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

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: redirectURL,
    });

    if (error) {
      resetMessage.textContent = error.message;
      resetMessage.style.color = "red";
    } else {
      resetMessage.textContent = "Reset email sent!";
      resetMessage.style.color = "green";
    }
  });
});
