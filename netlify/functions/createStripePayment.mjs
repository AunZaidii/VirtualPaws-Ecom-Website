import Stripe from 'stripe';

// Initialize Stripe with secret key from environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { amount, currency, paymentMethodId, email, description } = JSON.parse(event.body);

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit (cents for USD)
      currency: currency || 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description: description || 'Virtual Paws Order',
      receipt_email: email,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        paymentIntent: paymentIntent,
        clientSecret: paymentIntent.client_secret
      }),
    };
  } catch (error) {
    console.error("Stripe payment error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Payment processing failed",
      }),
    };
  }
};
