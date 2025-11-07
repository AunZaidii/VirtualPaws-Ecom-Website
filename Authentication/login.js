// ------------------------------
// 🔧 CONFIGURE SUPABASE CLIENT
// ------------------------------
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

let supabaseClient;

// Make sure Supabase script is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof supabase === "undefined") {
    console.error("❌ Supabase library not loaded. Check your <script> tag order.");
    alert("Supabase library failed to load. Please refresh the page.");
    return;
  }

  const { createClient } = supabase;
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log("✅ Supabase client initialized");

  const form = document.querySelector(".login-form");
  if (!form) {
    console.error("❌ Login form not found in DOM.");
    return;
  }

  // Message display element
  const message = document.createElement("p");
  message.classList.add("login-message");
  message.style.padding = "10px";
  message.style.borderRadius = "5px";
  message.style.marginTop = "1vw";
  message.style.fontSize = "1vw";
  form.appendChild(message);

  // ------------------------------
  // 🔐 LOGIN HANDLER
  // ------------------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();

    if (!email || !password) {
      message.textContent = "❌ Please enter email and password.";
      message.style.color = "red";
      return;
    }

    message.textContent = "⏳ Signing in...";
    message.style.color = "#333";

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        message.textContent = `❌ ${error.message || "Login failed."}`;
        message.style.color = "red";
        return;
      }

      if (data.session) {
        console.log("✅ Login success:", data.user.email);
        message.textContent = "✅ Logged in successfully! Redirecting...";
        message.style.color = "green";

        // Save session locally
        localStorage.setItem("userSession", JSON.stringify(data.session));
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect after 1.5 seconds
        setTimeout(() => {
          window.location.href = "../Homepage/homepage.html";
        }, 1500);
      } else {
        message.textContent = "❌ Login failed. Please try again.";
        message.style.color = "red";
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      message.textContent = "❌ Connection error. Please try again.";
      message.style.color = "red";
    }
  });

  // ------------------------------
  // 👁️ TOGGLE PASSWORD VISIBILITY
  // ------------------------------
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

  // ------------------------------
  // 🔄 FORGOT PASSWORD SECTION
  // ------------------------------
  const forgotLink = document.getElementById("forgotPasswordLink");
  const resetSection = document.getElementById("resetSection");
  const sendResetEmailBtn = document.getElementById("sendResetEmail");
  const resetEmailInput = document.getElementById("resetEmail");
  const resetMessage = document.getElementById("resetMessage");

  if (forgotLink && resetSection && sendResetEmailBtn) {
    // Show reset section
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      resetSection.style.display = "block";
      resetMessage.textContent = "";
    });

    // Send password reset email
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
          "✅ Password reset email sent! Please check your inbox.";
        resetMessage.style.color = "green";
      } catch (err) {
        console.error("Reset password error:", err.message);
        resetMessage.textContent =
          "❌ Failed to send reset email. Please try again later.";
        resetMessage.style.color = "red";
      }
    });
  }
});
