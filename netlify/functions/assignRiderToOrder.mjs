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

    const { order_id, rider_id, rider_name, rider_phone, rider_image } = JSON.parse(event.body);

    if (!order_id || !rider_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: order_id, rider_id' }),
      };
    }

    const { data, error } = await supabase
      .from('orders')
      .update({
        rider_id,
        rider_name,
        rider_phone,
        rider_image,
      })
      .eq('order_id', order_id)
      .select();

    if (error) {
      console.error('Error assigning rider to order:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, order: data[0] }),
    };
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
