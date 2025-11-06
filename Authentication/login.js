// ✅ Initialize Supabase
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ Handle login form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");

  // Create message box dynamically (you can also add this in HTML)
  const messageBox = document.createElement("p");
  messageBox.classList.add("login-message");
  form.appendChild(messageBox);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get user input
    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();

    // Reset message box
    messageBox.textContent = "";
    messageBox.style.color = "#333";

    if (!email || !password) {
      messageBox.textContent = "Please enter both email and password!";
      messageBox.style.color = "red";
      return;
    }

    try {
      // 🔍 Check user in Supabase
      const { data, error } = await supabaseClient
        .from("user") // or "users" — use your actual table name
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        messageBox.textContent = "Login failed. Please try again.";
        messageBox.style.color = "red";
        return;
      }

      if (data) {
        messageBox.textContent = `Welcome back, ${data["fisrt name"] || data["first_name"]}!`;
        messageBox.style.color = "green";

        // Optional: store login info locally (e.g., user ID)
        localStorage.setItem("loggedInUser", JSON.stringify(data));

        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = "/Homepage/homepage.html";
        }, 2000);
      } else {
        messageBox.textContent = "Invalid email or password.";
        messageBox.style.color = "red";
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
