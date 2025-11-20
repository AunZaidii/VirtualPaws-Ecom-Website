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
    const { vet_id, name, phone, date, time, notes } = JSON.parse(event.body);

    // Clean phone number: remove all non-numeric characters
    const cleanPhone = phone ? phone.toString().replace(/\D/g, "") : null;
    const phoneNumber = cleanPhone ? parseInt(cleanPhone, 10) : null;

    const { data, error } = await supabase.from("appointment").insert([
      {
        vet_id,
        user_id: null,
        name,
        phone: phoneNumber,
        date,
        time,
        status: "pending",
        notes,
      },
    ]);

    if (error) {
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

