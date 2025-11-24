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
    const { data: feedback, error } = await supabase
      .from("contact")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        feedback: feedback || []
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: err.message 
      }),
    };
  }
};
