import { createClient } from "@supabase/supabase-js";
export const handler = async (event, context) => {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );

      const { id } = event.queryStringParameters;

  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("product_id", id)
    .single();
    if (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    }; 
}
