// ✅ Initialize Supabase client
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  const message = document.createElement("p");
  message.classList.add("login-message");
  form.appendChild(message);

  // -------------------- LOGIN HANDLER --------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();

    message.textContent = "";
    message.style.color = "#333";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      message.textContent = "Invalid email or password.";
      message.style.color = "red";
    } else {
      message.textContent = "✅ Logged in successfully! Redirecting...";
      message.style.color = "green";
      localStorage.setItem("userSession", JSON.stringify(data.session));

      setTimeout(() => {
        window.location.href = "/Homepage/homepage.html";
      }, 2000);
    }
  });

  // -------------------- TOGGLE PASSWORD VISIBILITY --------------------
  const togglePassword = document.querySelector(".toggle-password");
  const passwordField = form.querySelector('input[name="password"]');
  togglePassword.addEventListener("click", () => {
    const type =
      passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });

  // -------------------- FORGOT PASSWORD SECTION --------------------
  const forgotLink = document.getElementById("forgotPasswordLink");
  const resetSection = document.getElementById("resetSection");
  const sendResetEmailBtn = document.getElementById("sendResetEmail");
  const resetEmailInput = document.getElementById("resetEmail");
  const resetMessage = document.getElementById("resetMessage");

  // show the reset section when the link is clicked
  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    resetSection.style.display = "block";
    resetMessage.textContent = "";
  });

  // send the reset link
  sendResetEmailBtn.addEventListener("click", async () => {
    const email = resetEmailInput.value.trim();

    if (!email) {
      resetMessage.style.color = "red";
      resetMessage.textContent = "Please enter your email.";
      return;
    }

    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo:
          "http://127.0.0.1:5507/Authentication/reset-password.html",
      });

      if (error) throw error;

      resetMessage.style.color = "green";
      resetMessage.textContent =
        "✅ Password reset email sent! Please check your inbox.";
    } catch (err) {
      console.error("Error:", err);
      resetMessage.style.color = "red";
      resetMessage.textContent =
        "❌ Failed to send reset email. Please try again later.";
    }
  });
});
