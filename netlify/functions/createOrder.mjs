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
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "No authorization header" }),
      };
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const orderData = JSON.parse(event.body);

    // Decrement stock for each product in the order
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        const productId = item.product_id;
        const quantityOrdered = item.quantity || 1;

        // Get current stock
        const { data: product, error: fetchError } = await supabase
          .from("product")
          .select("stock")
          .eq("product_id", productId)
          .single();

        if (!fetchError && product) {
          const newStock = Math.max(0, product.stock - quantityOrdered);
          
          // Update stock
          await supabase
            .from("product")
            .update({ stock: newStock })
            .eq("product_id", productId);
        }
      }
    }

    const { data, error } = await supabase.from("orders").insert({
      user_id: user.id,
      ...orderData
    });

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    // Clear cart after order
    await supabase.from("cart").delete().eq("user_id", user.id);

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

