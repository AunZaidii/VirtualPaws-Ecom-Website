const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

let supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  
  const form = document.querySelector(".login-form");
  const loginMessage = document.querySelector(".login-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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
        loginMessage.textContent = `${error.message || "Login failed."}`;
        loginMessage.style.color = "red";
        return;
      }

      if (data.session && data.user) {
        loginMessage.textContent = "Logged in successfully!";
        loginMessage.style.color = "green";

        localStorage.setItem("userSession", JSON.stringify(data.session));
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
          window.location.href = "../Homepage/homepage.html";
        }, 1500);
      } else {
        loginMessage.textContent = "Login failed. Please try again.";
        loginMessage.style.color = "red";
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      loginMessage.textContent = "Connection error. Please try again.";
      loginMessage.style.color = "red";
    }
  });

  const togglePassword = document.querySelector(".toggle-password");
  const passwordField = form.querySelector('input[name="password"]');

  if (togglePassword && passwordField) {
    togglePassword.addEventListener("click", () => {
      const type =
        passwordField.getAttribute("type") === "password" ? "text" : "password";
      passwordField.setAttribute("type", type);
      togglePassword.classList.toggle("fa-eye");
      togglePassword.classList.toggle("fa-eye-slash");
    });
  }

  const forgotLink = document.getElementById("forgotPasswordLink");
  const resetSection = document.getElementById("resetSection");
  const sendResetEmailBtn = document.getElementById("sendResetEmail");
  const resetEmailInput = document.getElementById("resetEmail");
  const resetMessage = document.getElementById("resetMessage");

  if (forgotLink && resetSection && sendResetEmailBtn) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      resetSection.style.display = "block";
      resetMessage.textContent = "";
    });

    sendResetEmailBtn.addEventListener("click", async () => {
      const email = resetEmailInput.value.trim();

      if (!email) {
        resetMessage.textContent = "Please enter your email.";
        resetMessage.style.color = "red";
        return;
      }

      try {
        const resetURL = `${window.location.origin}/Authentication/reset-password.html`;
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: resetURL,
        });

        if (error) throw error;

        resetMessage.textContent =
          "Password reset email sent! Please check your inbox.";
        resetMessage.style.color = "green";
      } catch (err) {
        console.error("Reset password error:", err.message);
        resetMessage.textContent =
          "Failed to send reset email. Please try again later.";
        resetMessage.style.color = "red";
      }
    });
  }
});
