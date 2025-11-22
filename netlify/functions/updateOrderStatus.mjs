import { createClient } from "@supabase/supabase-js";

const statusSteps = [
  "Order Placed",
  "Order Confirmed",
  "Out for Delivery",
  "Delivered"
];

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const body = JSON.parse(event.body);
    const { order_number, email, tracking_status, location, revert } = body;

    if (!order_number || !email || !tracking_status) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required parameters: order_number, email, tracking_status",
        }),
      };
    }

    // Get current order
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", order_number)
      .eq("email", email)
      .single();

    if (fetchError || !order) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Order not found" }),
      };
    }

    // Build new tracking history entry
    const newHistoryEntry = {
      title: tracking_status,
      timestamp: new Date().toISOString(),
      location: location || order.current_location || "Virtual Paws Warehouse"
    };

    // Get existing tracking history or initialize
    let trackingHistory = order.tracking_history || [];
    if (!Array.isArray(trackingHistory)) {
      trackingHistory = [];
    }

    let finalStatus = tracking_status;

    // If reverting, go back to previous status
    if (revert) {
      // Find current index in status steps
      const currentIndex = statusSteps.indexOf(order.tracking_status);
      if (currentIndex > 0) {
        finalStatus = statusSteps[currentIndex - 1];
        // Remove last entry from tracking history
        trackingHistory.pop();
      }
    } else {
      // Find current status index and new status index
      const currentIndex = statusSteps.indexOf(order.tracking_status);
      const newIndex = statusSteps.indexOf(tracking_status);

      // Ensure ALL statuses from beginning to new status are in history
      const now = new Date();
      
      // Check and add all statuses from index 0 to newIndex
      for (let i = 0; i <= newIndex; i++) {
        const statusName = statusSteps[i];
        
        // Check if this status already exists in history
        const existsInHistory = trackingHistory.find(h => h.title === statusName);
        
        if (!existsInHistory) {
          // Calculate timestamp - each missing step gets added with incremental time
          const timeOffset = (i - currentIndex) * 1000; // 1 second apart
          const timestamp = new Date(now.getTime() + timeOffset);
          
          const entry = {
            title: statusName,
            timestamp: timestamp.toISOString(),
            location: location || order.current_location || "Virtual Paws Warehouse"
          };
          
          trackingHistory.push(entry);
        }
      }

      // Sort tracking history by the order of statusSteps to maintain proper sequence
      trackingHistory.sort((a, b) => {
        const indexA = statusSteps.indexOf(a.title);
        const indexB = statusSteps.indexOf(b.title);
        return indexA - indexB;
      });
    }

    // Update order status in database
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        tracking_status: finalStatus,
        tracking_history: trackingHistory,
        updated_at: new Date().toISOString(),
      })
      .eq("order_number", order_number)
      .eq("email", email)
      .select()
      .single();

    if (updateError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: updateError.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(updatedOrder),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
