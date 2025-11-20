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
    const { id } = event.queryStringParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "id is required" }),
      };
    }

    const { data: petRow, error: petError } = await supabase
      .from("pet")
      .select(`
        pet_id,
        name,
        species,
        gender,
        breed,
        age,
        size,
        color,
        location,
        description,
        temperament,
        health_status,
        tags,
        last_vet_visit,
        diet,
        vaccinations,
        fee,
        adoption_req,
        shelter_id,
        shelter_name,
        image1,
        image2,
        image3
      `)
      .eq("pet_id", id)
      .single();

    if (petError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: petError.message }),
      };
    }

    let shelterRow = null;
    if (petRow.shelter_id) {
      const { data: sRow, error: sError } = await supabase
        .from("shelter")
        .select("shelter_id, shelter_name, address, phone, email, verified")
        .eq("shelter_id", petRow.shelter_id)
        .single();

      if (!sError) {
        shelterRow = sRow;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ pet: petRow, shelter: shelterRow }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

