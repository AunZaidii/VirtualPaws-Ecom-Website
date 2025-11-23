import { apiClient } from "../utils/apiClient.js";

// Toast Function
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  
  toast.textContent = message;

  if (type === "success") toast.style.background = "#7ED957";
  else if (type === "error") toast.style.background = "#dc3545";
  else toast.style.background = "#333";

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

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
      showToast("Your message has been sent successfully!", "success");
      form.reset();
    } catch (err) {
      console.error("Unexpected error:", err);
      showToast(err.message || "Something went wrong!", "error");
    }
  });
});
