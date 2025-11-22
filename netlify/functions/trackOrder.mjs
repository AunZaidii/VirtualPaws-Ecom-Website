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
    // Get query parameters
    const { order_number, email } = event.queryStringParameters || {};

    if (!order_number || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required parameters: order_number and email",
        }),
      };
    }

    // Query orders table for matching order_number and email
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", order_number)
      .eq("email", email)
      .single(); // Return single record or error if not found

    if (error) {
      // 'single()' returns PGRST116 if no rows found
      if (error.code === "PGRST116") {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Order not found" }),
        };
      }
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
