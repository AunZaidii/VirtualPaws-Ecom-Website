import { createClient } from "@supabase/supabase-js";

export const handler = async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    if (event.httpMethod === "POST") {
      // Send reset email
      const { email, redirectTo } = JSON.parse(event.body);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo || `${event.headers.origin || ""}/Authentication/reset-password.html`,
      });

      if (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: error.message }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Reset email sent" }),
      };
    } else if (event.httpMethod === "PUT") {
      // Update password
      const { password } = JSON.parse(event.body);
      const authHeader = event.headers.authorization || event.headers.Authorization;

      if (!authHeader) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "No authorization header" }),
        };
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

      if (getUserError || !user) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid token" }),
        };
      }

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: error.message }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Password updated successfully" }),
      };
    }

    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

