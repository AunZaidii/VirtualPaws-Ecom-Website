import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
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

    const { rider_id } = JSON.parse(event.body);

    if (!rider_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required field: rider_id' }),
      };
    }

    const { data, error } = await supabase
      .from('rider')
      .delete()
      .eq('rider_id', rider_id)
      .select();

    if (error) {
      console.error('Error deleting rider:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, deleted: data[0] }),
    };
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
