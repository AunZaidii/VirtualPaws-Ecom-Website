import { createClient } from "@supabase/supabase-js";

// Generate short ID (3 letters + 3 numbers)
function generateShortId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let shortId = "";
  
  // 3 random letters
  for (let i = 0; i < 3; i++) {
    shortId += letters[Math.floor(Math.random() * letters.length)];
  }
  
  // 3 random numbers
  for (let i = 0; i < 3; i++) {
    shortId += Math.floor(Math.random() * 10);
  }
  
  return shortId;
}

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
        status: "Pending",
        notes,
        booking_id: generateShortId()
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

