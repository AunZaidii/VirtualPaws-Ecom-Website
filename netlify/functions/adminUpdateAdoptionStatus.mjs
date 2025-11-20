import { createClient } from "@supabase/supabase-js";

export const handler = async (event) => {
  if (event.httpMethod !== "PUT") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { adoption_id, status } = JSON.parse(event.body);

    const { error } = await supabase
      .from("adoption")
      .update({ status: status })
      .eq("adoption_id", adoption_id);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Adoption status updated successfully" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

