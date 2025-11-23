import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { rider_name, rider_phone, rider_image, numberplate } = JSON.parse(event.body);

    if (!rider_name || !rider_phone || !numberplate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: rider_name, rider_phone, numberplate' }),
      };
    }

    const { data, error } = await supabase
      .from('rider')
      .insert([
        {
          rider_name,
          rider_phone,
          rider_image: rider_image || null,
          numberplate,
        }
      ])
      .select();

    if (error) {
      console.error('Error adding rider:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, rider: data[0] }),
    };
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
