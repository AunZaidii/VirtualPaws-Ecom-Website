import { createClient } from "@supabase/supabase-js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    // Check environment variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error("Missing environment variables");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

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
      console.error("Auth error:", authError?.message);
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

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

    let { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      // Handle case where user profile doesn't exist - auto-create for OAuth users
      if (error.code === "PGRST116" || error.message?.includes("No rows")) {
        // Extract name from metadata
        const { first_name, last_name } = extractNameFromMetadata(user);
        
        const { data: newProfile, error: createError } = await supabase
          .from("user")
          .insert({
            user_id: user.id,
            first_name: first_name,
            last_name: last_name,
            email: user.email,
            phone_no: user.user_metadata?.phone || null,
            password: "" // OAuth users don't have passwords, use empty string
          })
          .select()
          .single();

        if (createError) {
          console.error("Failed to auto-create user profile:", createError);
          return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to create user profile" }),
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify(newProfile),
        };
      }
      console.error("Database error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message || "Database error" }),
      };
    }

    // If profile exists but has empty names, update from user metadata
    if (data && (!data.first_name || data.first_name === 'User' || !data.last_name)) {
      const { first_name, last_name } = extractNameFromMetadata(user);
      
      // Only update if we have better data from metadata
      if (first_name && first_name !== 'User' && first_name !== data.first_name) {
        const updateData = {};
        if (!data.first_name || data.first_name === 'User') {
          updateData.first_name = first_name;
        }
        if (!data.last_name && last_name) {
          updateData.last_name = last_name;
        }
        
        if (Object.keys(updateData).length > 0) {
          const { data: updatedProfile, error: updateError } = await supabase
            .from("user")
            .update(updateData)
            .eq("user_id", user.id)
            .select()
            .single();
          
          if (!updateError && updatedProfile) {
            data = updatedProfile;
          }
        }
      }
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

