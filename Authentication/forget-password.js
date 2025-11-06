const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".forgot-form");
  const msg = form.querySelector(".forgot-message");
  const devLink = form.querySelector(".dev-link");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.style.color = "#333";
    devLink.textContent = "";

    const email = form.querySelector('input[name="email"]').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      msg.textContent = "Please enter a valid email.";
      msg.style.color = "red";
      return;
    }

    // Optional: verify the email exists in your user table
    const { data: userRow, error: userErr } = await supabaseClient
      .from("user") // or "users"
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (userErr) {
      console.error(userErr);
      msg.textContent = "Something went wrong. Try again.";
      msg.style.color = "red";
      return;
    }
    if (!userRow) {
      // Don't reveal whether the email exists (privacy). Show generic message:
      msg.textContent = "If that email exists, a reset link will be created.";
      msg.style.color = "green";
      return;
    }

    const resetToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    const { error: insErr } = await supabaseClient
      .from("password_resets")
      .insert([{ email, reset_token: resetToken, expires_at: expiresAt }]);

    if (insErr) {
      console.error(insErr);
      showMessage(msg, "Something went wrong. Try again.", "error");

      return;
    }

    showMessage(msg, "Reset link created!", "success");


    // DEV: show link (later you’ll email this)
    const link = `${location.origin}/ResetPassword/reset-password.html?token=${encodeURIComponent(resetToken)}`;
    devLink.innerHTML = `Reset link: <a href="${link}">${link}</a>`;
  });
});
// ✨ Helper to display messages smoothly
function showMessage(element, text, type = "success") {
  element.textContent = text;
  element.className = ""; // reset classes
  element.classList.add(type, "show");
}
