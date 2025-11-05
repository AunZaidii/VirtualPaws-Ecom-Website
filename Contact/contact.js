// Initialize Supabase
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
      const { data, error } = await supabaseClient
        .from("contact")
        .insert([{ name, email, phone, comment }]);

      if (error) {
        console.error("Error saving data:", error.message);
        alert("Failed to submit. Please try again.");
      } else {
        alert("Your message has been sent successfully!");
        form.reset();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong!");
    }
  });
});
