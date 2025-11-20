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
    const { email, password, firstName, lastName } = JSON.parse(event.body);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName }
      }
    });

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message }),
      };
    }

    if (!data.user) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Registration failed" }),
      };
    }

    // Insert into user table
    const { error: dbError } = await supabase
      .from("user")
      .insert({
        user_id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
        password
      });

    if (dbError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Saved to auth, but failed to save profile" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: data.user,
        session: data.session,
        access_token: data.session?.access_token,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

