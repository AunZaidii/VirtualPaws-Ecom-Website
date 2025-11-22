import { createClient } from "@supabase/supabase-js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    // Get user from authorization header
    const authHeader = event.headers.authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid token" }),
      };
    }

    // Get user's phone number from the user table
    const { data: userData, error: userDataError } = await supabase
      .from("user")
      .select("phone_no, email")
      .eq("user_id", user.id)
      .single();

    if (userDataError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: userDataError.message }),
      };
    }

    // Clean the phone number from user profile (same format as createAppointment)
    const userPhone = userData.phone_no ? userData.phone_no.toString().replace(/\D/g, "") : null;
    const userPhoneNumber = userPhone ? parseInt(userPhone, 10) : null;

    console.log("User phone from profile:", userData.phone_no);
    console.log("Cleaned user phone:", userPhoneNumber);

    // Fetch appointments for this user with vet details
    // Match by phone number or email since appointments don't store user_id
    let query = supabase
      .from("appointment")
      .select(`
        *,
        vet:vet_id (*)
      `);

    // Try to match by phone if available, otherwise try email
    if (userPhoneNumber) {
      query = query.eq("phone", userPhoneNumber);
    }

    const { data: appointments, error } = await query.order("date", { ascending: false });

    console.log("Found appointments:", appointments ? appointments.length : 0);
    if (appointments && appointments.length > 0) {
      console.log("Sample appointment:", appointments[0]);
    }

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(appointments || []),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
