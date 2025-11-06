// ✅ Initialize Supabase
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");

  const messageBox = document.createElement("p");
  messageBox.classList.add("register-message");
  form.appendChild(messageBox);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const first_name = form.querySelector('input[name="first_name"]').value.trim();
    const last_name = form.querySelector('input[name="last_name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();

    messageBox.textContent = "";
    messageBox.style.color = "#333";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      messageBox.textContent = "Please enter a valid email address!";
      messageBox.style.color = "red";
      return;
    }

    if (password.length < 8) {
      messageBox.textContent = "Password must be at least 8 characters long!";
      messageBox.style.color = "red";
      return;
    }

    if (!first_name || !last_name) {
      messageBox.textContent = "Please fill out all fields!";
      messageBox.style.color = "red";
      return;
    }

    try {
      // 🔍 Check if email already exists
      const { data: existingUser, error: fetchError } = await supabaseClient
        .from("user") // or "users"
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (fetchError) {
        console.error("Supabase fetch error:", fetchError);
        messageBox.textContent = "Something went wrong. Try again later.";
        messageBox.style.color = "red";
        return;
      }

      if (existingUser) {
        messageBox.textContent = "This email is already registered!";
        messageBox.style.color = "red";
        return;
      }

      // ✅ If not registered, insert new record
      const { error: insertError } = await supabaseClient
        .from("user")
        .insert([
          {
            "fisrt name": first_name,
            "last name": last_name,
            email,
            password,
          },
        ]);

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        messageBox.textContent = "Registration failed. Please try again.";
        messageBox.style.color = "red";
      } else {
        messageBox.textContent = "✅ Account created successfully! Redirecting...";
        messageBox.style.color = "green";
        form.reset();

        setTimeout(() => {
          window.location.href = "/Login/login.html";
        }, 2000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      messageBox.textContent = "Something went wrong. Please try again.";
      messageBox.style.color = "red";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const input = icon.previousElementSibling;

      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  });
});

