const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

let supabaseClient;

if (typeof supabase !== "undefined") {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error("Supabase library not loaded!");
}

let firstName = "";
let lastName = "";
let emailValue = "";
let phoneValue = "";

document.addEventListener("DOMContentLoaded", async () => {
  if (!supabaseClient) return;

  // DOM Elements
  const fullNameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  const editBtn = document.getElementById("edit-profile-btn");
  const editActions = document.getElementById("edit-actions");
  const saveBtn = editActions.querySelector(".btn-primary");
  const cancelBtn = editActions.querySelector(".btn-secondary");

  // Get authenticated user
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
  if (authError || !user) {
    console.error("User not logged in:", authError);
    window.location.href = "./login.html";
    return;
  }

  const userId = user.id;

  // Fetch profile from table editor's user table
  const { data: userData, error: userError } = await supabaseClient
    .from("user")
    .select("first_name, last_name, email, phone_no")
    .eq("user_id", userId)
    .single();

  if (userError || !userData) {
    console.error("Failed to fetch user data:", userError);
    return;
  }

  // Store initial values
  firstName = userData.first_name;
  lastName = userData.last_name;
  emailValue = userData.email;
  phoneValue = userData.phone_no || "";

  // Fill inputs
  fullNameInput.value = `${firstName} ${lastName}`;
  emailInput.value = emailValue;
  phoneInput.value = phoneValue;

  // --- Enable Editing ---
  function toggleEditMode() {
    fullNameInput.disabled = false;
    emailInput.disabled = false;
    phoneInput.disabled = false;

    editBtn.style.display = "none";
    editActions.classList.remove("hidden");
  }

  // --- Cancel Editing ---
  function cancelEdit() {
    fullNameInput.value = `${firstName} ${lastName}`;
    emailInput.value = emailValue;
    phoneInput.value = phoneValue;

    fullNameInput.disabled = true;
    emailInput.disabled = true;
    phoneInput.disabled = true;

    editActions.classList.add("hidden");
    editBtn.style.display = "inline-flex";
  }

  // --- Save Changes ---
  async function saveProfile() {
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!fullName || !email || !phone) {
      alert("Name, email, and phone number cannot be empty.");
      return;
    }

    const nameParts = fullName.split(" ");
    const newFirstName = nameParts[0];
    const newLastName = nameParts.slice(1).join(" ") || "";

    console.log("Updating user:", {
      first_name: newFirstName,
      last_name: newLastName,
      email: email,
      phone_no: phone
    });

    const { error: userTableError } = await supabaseClient
      .from("user")
      .update({
        first_name: newFirstName,
        last_name: newLastName,
        email: email,
        phone_no: phone
      })
      .eq("user_id", userId);

    if (userTableError) {
      console.error("Update failed:", userTableError);
      alert("Failed to update profile.");
      return;
    }

    firstName = newFirstName;
    lastName = newLastName;
    emailValue = email;
    phoneValue = phone;

    fullNameInput.disabled = true;
    emailInput.disabled = true;
    phoneInput.disabled = true;

    editActions.classList.add("hidden");
    editBtn.style.display = "inline-flex";
}


  editBtn.addEventListener("click", toggleEditMode);
  saveBtn.addEventListener("click", saveProfile);
  cancelBtn.addEventListener("click", cancelEdit);
});
