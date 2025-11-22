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
    const [
      { data: products },
      { data: vets },
      { data: pets },
      { data: shelters },
      { data: adoptions },
      { data: appointments }
    ] = await Promise.all([
      supabase.from("product").select("*"),
      supabase.from("vet").select("*"),
      // Admin needs to see ALL pets including hidden ones for adoption management
      supabase.from("pet").select("*"),
      supabase.from("shelter").select("*"),
      supabase.from("adoption").select("*"),
      supabase.from("appointment").select("*")
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        products: products || [],
        vets: vets || [],
        pets: pets || [],
        shelters: shelters || [],
        adoptions: adoptions || [],
        appointments: appointments || []
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

