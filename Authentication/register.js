// ✅ Initialize Supabase client
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co"; // <-- replace
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";               // <-- replace

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ Handle form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  const message = document.createElement("p");
  message.classList.add("register-message");
  form.appendChild(message);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();

    message.textContent = "";
    message.style.color = "#333";

    // Basic validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailPattern.test(email)) {
      message.textContent = "Please enter a valid email address!";
      message.style.color = "red";
      return;
    }
    if (password.length < 8) {
      message.textContent = "Password must be at least 8 characters!";
      message.style.color = "red";
      return;
    }

    // ✅ Create user in Supabase Auth
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error:", error.message);
      message.textContent = error.message;
      message.style.color = "red";
    } else {
      message.textContent =
        "✅ Account created! Please check your email for verification link.";
      message.style.color = "green";
      form.reset();
    }
  });
});
