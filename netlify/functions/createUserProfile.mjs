import { createClient } from "@supabase/supabase-js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "No authorization header" }),
      };
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    // Check if user profile already exists
    const { data: existingProfile } = await supabase
      .from("user")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (existingProfile) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "User profile already exists", user: existingProfile }),
      };
    }

    // Parse request body for user data
    const { first_name, last_name, phone_no } = JSON.parse(event.body || "{}");

    // Helper function to extract name from Google OAuth metadata
    function extractNameFromMetadata(user) {
      // Google OAuth typically provides full_name in user_metadata
      const fullName = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.user_metadata?.display_name ||
                      '';
      
      if (fullName) {
        const nameParts = fullName.trim().split(/\s+/);
        return {
          first_name: nameParts[0] || 'User',
          last_name: nameParts.slice(1).join(' ') || ''
        };
      }
      
      // Fallback to individual fields
      return {
        first_name: user.user_metadata?.first_name || 
                   user.user_metadata?.given_name ||
                   'User',
        last_name: user.user_metadata?.last_name || 
                  user.user_metadata?.family_name ||
                  ''
      };
    }

    // Extract name from user metadata if not provided in request
    const extractedName = extractNameFromMetadata(user);
    const firstName = first_name || extractedName.first_name;
    const lastName = last_name || extractedName.last_name;
    const phone = phone_no || user.user_metadata?.phone || null;

    // Create user profile
    const { data, error } = await supabase
      .from("user")
      .insert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        email: user.email,
        phone_no: phone,
        password: "" // OAuth users don't have passwords, use empty string
      })
      .select()
      .single();

    if (error) {
      console.error("Database error creating user profile:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message || "Failed to create user profile" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Internal server error" }),
    };
  }
};

