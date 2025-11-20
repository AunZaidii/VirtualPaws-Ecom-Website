import { apiClient } from "../utils/apiClient.js";

// Handle form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const name = form.querySelector('input[placeholder="Name"]').value.trim();
    const email = form.querySelector('input[placeholder="Email *"]').value.trim();
    const phone = form.querySelector('input[placeholder="Phone number"]').value.trim();
    const comment = form.querySelector("textarea").value.trim();

    if (!email) {
      alert("Email is required!");
      return;
    }

    try {
      await apiClient.post("submitContact", { name, email, phone, comment });
      alert("Your message has been sent successfully!");
      form.reset();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert(err.message || "Something went wrong!");
    }
  });
});
