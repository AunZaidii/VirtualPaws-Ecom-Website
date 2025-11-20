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
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
      return {
        statusCode: 200,
        body: JSON.stringify({ exists: false }),
      };
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return {
        statusCode: 200,
        body: JSON.stringify({ exists: false }),
      };
    }

    const { product_id } = event.queryStringParameters || {};

    if (!product_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "product_id is required" }),
      };
    }

    const { data } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", product_id)
      .maybeSingle();

    return {
      statusCode: 200,
      body: JSON.stringify({ exists: !!data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

