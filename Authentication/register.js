import { supabaseClient } from "../SupabaseClient/supabaseClient.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  const registerBtn = document.querySelector(".login-btn");

  const message = document.createElement("p");
  message.classList.add("register-message");
  message.style.marginTop = "1vw";
  form.appendChild(message);

  // REGISTER BUTTON CLICK
  registerBtn.addEventListener("click", async () => {

    const firstName = form.querySelector('input[name="first_name"]').value.trim();
    const lastName = form.querySelector('input[name="last_name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();

    message.textContent = "";
    message.style.color = "#333";

    // VALIDATION
    if (!firstName || !lastName) {
      message.textContent = "Please enter first and last name!";
      message.style.color = "red";
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      message.textContent = "Please enter a valid email!";
      message.style.color = "red";
      return;
    }

    if (password.length < 8) {
      message.textContent = "Password must be at least 8 characters!";
      message.style.color = "red";
      return;
    }

    message.textContent = "Creating account...";

    try {
      // SIGN UP USER IN SUPABASE AUTH
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName }
        }
      });

      if (error) {
        message.textContent = error.message;
        message.style.color = "red";
        return;
      }

      if (!data.user) {
        message.textContent = "Registration failed.";
        message.style.color = "red";
        return;
      }

      // INSERT IN CUSTOM `user` TABLE
      const { error: dbError } = await supabaseClient
        .from("user")
        .insert({
          user_id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email,
          password
        });

      if (dbError) {
        message.textContent = "Saved to auth, but failed to save profile!";
        message.style.color = "red";
        return;
      }

      message.textContent = "Account created successfully!";
      message.style.color = "green";

      form.reset();

      setTimeout(() => {
        window.location.href = "./login.html";
      }, 2000);

    } catch (err) {
      console.error(err);
      message.textContent = "Unexpected error occurred.";
      message.style.color = "red";
    }
  });

  // PASSWORD SHOW/HIDE
  const togglePassword = document.querySelector(".toggle-password");
  const passwordField = form.querySelector('input[name="password"]');

  togglePassword.addEventListener("click", () => {
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;

    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });
});
