const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    const { data, error } = await supabaseClient.auth.updateUser({
      password: password,
    });

    if (error) throw error;

    message.style.color = "green";
    message.textContent = "Password updated successfully! Redirecting...";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (err) {
    console.error("Error resetting password:", err);
    message.style.color = "red";
    message.textContent = "Failed to reset password. Try again.";
  }
});
