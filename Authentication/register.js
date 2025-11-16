const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

let supabaseClient;

if (typeof supabase !== "undefined") {
  const { createClient } = supabase;
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error("Supabase library not loaded!");
}

document.addEventListener("DOMContentLoaded", () => {
  if (!supabaseClient) {
    console.error("Supabase client not initialized");
    return;
  }

  const form = document.querySelector(".login-form");
  if (!form) {
    console.error("Form not found");
    return;
  }

  const message = document.createElement("p");
  message.classList.add("register-message");
  message.style.padding = "10px";
  message.style.borderRadius = "5px";
  message.style.marginTop = "1vw";
  message.style.fontSize = "1vw";
  form.appendChild(message);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName =
      form.querySelector('input[name="first_name"]')?.value.trim() || "";
    const lastName =
      form.querySelector('input[name="last_name"]')?.value.trim() || "";
    const email = form.querySelector('input[name="email"]')?.value.trim() || "";
    const password =
      form.querySelector('input[name="password"]')?.value.trim() || "";

    message.textContent = "";
    message.style.color = "#333";

    if (!firstName || !lastName) {
      message.textContent = "Please enter first and last name!";
      message.style.color = "red";
      return;
    }

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

    message.textContent = "Creating account...";
    message.style.color = "#333";

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        console.error("Auth Error:", error);
        message.textContent = `${error.message || "Registration failed"}`;
        message.style.color = "red";
        return;
      }

      if (data && data.user) {
        const { error: userTableError } = await supabaseClient
          .from("user")
          .insert([
            {
              user_id: data.user.id, 
              first_name: firstName,
              last_name: lastName,
              email: email,
              password: password, 
            },
          ]);

        if (userTableError) {
          console.error("User Table Error:", userTableError);
          message.textContent = `Failed to save user info: ${userTableError.message}`;
          message.style.color = "red";
          return;
        }

        message.textContent =
          "Account created!";
        message.style.color = "green";
        form.reset();

        setTimeout(() => {
          window.location.href = "./login.html";
        }, 2500);
      } else {
        message.textContent = "Registration failed. Please try again.";
        message.style.color = "red";
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      message.textContent = "Connection error. Please try again.";
      message.style.color = "red";
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
});
