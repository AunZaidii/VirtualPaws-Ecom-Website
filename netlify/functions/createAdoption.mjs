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
    const body = JSON.parse(event.body || "{}");
    const { pet_id, shelter_id, name, email, phone, message } = body;

    // Validate required fields
    if (!pet_id || !name || !email || !phone || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields: pet_id, name, email, phone, message" }),
      };
    }

    // Clean phone number: remove all non-numeric characters (spaces, dashes, +, etc.)
    const cleanPhone = phone.toString().replace(/\D/g, "");
    
    // Validate phone number is not empty after cleaning
    if (!cleanPhone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid phone number format" }),
      };
    }
    
    // Convert to number for bigint column (PostgreSQL bigint accepts numeric strings)
    const phoneNumber = parseInt(cleanPhone, 10);

    const { data, error } = await supabase.from("adoption").insert({
      pet_id,
      shelter_id: shelter_id || null,
      name,
      email,
      phone: phoneNumber,
      message,
      status: "Pending",
      request_id: generateShortId()
    });

    if (error) {
      console.error("Supabase error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message, details: error }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message, stack: err.stack }),
    };
  }
};

