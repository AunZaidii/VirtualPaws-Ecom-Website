const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector(".reset-form");
  const msg = form.querySelector(".reset-message");

  // Add eye toggles
  const toggleIcons = document.querySelectorAll(".toggle-password");
  toggleIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const input = icon.previousElementSibling;
      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
      }
    });
  });

  // Get token from URL
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  if (!token) {
    msg.textContent = "Invalid reset link.";
    msg.style.color = "red";
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  // Quick client-side check (optional): ensure token exists and is not expired/used
  const { data: resetRow, error: resetErr } = await supabaseClient
    .from("password_resets")
    .select("used, expires_at")
    .eq("reset_token", token)
    .maybeSingle();

  if (resetErr || !resetRow) {
    msg.textContent = "This reset link is invalid.";
    msg.style.color = "red";
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  if (resetRow.used) {
    msg.textContent = "This reset link has already been used.";
    msg.style.color = "red";
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  if (new Date(resetRow.expires_at) <= new Date()) {
    msg.textContent = "This reset link has expired.";
    msg.style.color = "red";
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.style.color = "#333";

    const password = form.querySelector('input[name="password"]').value.trim();
    const confirm = form.querySelector('input[name="confirm_password"]').value.trim();

    if (password.length < 8) {
      msg.textContent = "Password must be at least 8 characters.";
      msg.style.color = "red";
      return;
    }
    if (password !== confirm) {
      msg.textContent = "Passwords do not match.";
      msg.style.color = "red";
      return;
    }

    // Call secure RPC to update user password and mark token used
    const { data: ok, error: rpcErr } = await supabaseClient
      .rpc("reset_password", { p_token: token, p_new_password: password });

    if (rpcErr || ok !== true) {
      console.error(rpcErr);
      showMessage(msg, "Something went wrong. Try again.", "error");

      return;
    }

    showMessage(msg, "Reset link created!", "success");


    setTimeout(() => {
      window.location.href = "/Login/login.html";
    }, 2000);
  });
});
// ✨ Helper to display messages smoothly
function showMessage(element, text, type = "success") {
  element.textContent = text;
  element.className = ""; // reset classes
  element.classList.add(type, "show");
}
