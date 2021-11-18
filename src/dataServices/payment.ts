import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
  apiVersion: "2020-08-27",
  typescript: true,
});

export const createCustomer_DS = async (
  params: Stripe.CustomerCreateParams
): Promise<Stripe.Customer> => {
  return await stripe.customers.create(params);
};

export const createPaymentIntent_DS = async (
  params: Stripe.PaymentIntentCreateParams
): Promise<Stripe.PaymentIntent> => {
  return await stripe.paymentIntents.create(params);
};

export const createIncompleteSubscription_DS = async (
  params: Stripe.SubscriptionCreateParams
) => {
  return await stripe.subscriptions.create({
    ...params,
    payment_behavior: "default_incomplete",
  });
};

/**
 * Creates and invoice containing a payment_intent.
 * Stripe.PaymentIntent TRacks Lifecyle of every payment
 * */
export const createPaymentIntentId_DS = async (
  params: Stripe.InvoiceCreateParams
) => {
  const invoice = await stripe.invoices.create(params);
  // return this to the Frontend to the checkout session.

  // Stripe.PaymentIntent TRacks Lifecyle of every payment
  // When a payment is due for a subscription, the invoice, and therefore the payment intend is created
  const paymentIntent: Stripe.PaymentIntent | string | null =
    invoice.payment_intent;

  // TODO: Check if paymentIntent is null
  return paymentIntent;
};

export const createCheckoutSession_DS = async (
  params: Stripe.Checkout.SessionCreateParams
) => {
  return await stripe.checkout.sessions.create({ ...params });
};

export const confirmPaymentIntent_DS = async (
  paymentIntentId: string,
  params: Stripe.PaymentIntentConfirmParams
) => {
  return await stripe.paymentIntents.confirm(paymentIntentId, { ...params });
};

export const getCheckoutSession_DS = async (
  sessionId: string
): Promise<Stripe.Checkout.Session> => {
  return await stripe.checkout.sessions.retrieve(sessionId);
};

export const getProductIds_DS = async () => {
  const productList: Stripe.ApiList<Stripe.Product> =
    await stripe.products.list();

  return productList.data.map((product) => product.id);
};

export const getProducts_DS = async () => {
  const productList: Stripe.ApiList<Stripe.Product> =
    await stripe.products.list();

  return productList.data;
};

export const retrievePriceFromProduct_DS = async (productId: string) => {
  const pricesList = await stripe.prices.list({
    expand: ["data.product"],
  });
  // Safe to expand the product
  const pricesForProduct = pricesList.data.filter(
    (price) => (price.product as Stripe.Product).id === productId
  );
  // we assume there is only one price per product
  return pricesForProduct[0];
};
// Match the raw body to content type application/json
export const webhookListenerFn = async (request: any, response: any) => {
  const sig = request.headers["stripe-signature"];

  /*
  const pricesFromProduct = await retrievePriceFromProduct(
    "prod_KbhDdNESTpMC7A"
  );


*/
  const price = await retrievePriceFromProduct_DS("prod_KbhDdNESTpMC7A");

  const stripe_checkoutSessionId = await createCheckoutSession_DS({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: price.id,
        // For metered billing, do not pass quantity
        // quantity: 1,
      },
    ],
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:3000/errorPayment",
  });

  console.log(stripe_checkoutSessionId);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  const eventType = event!.type;
  const eventDataObject = event!.data.object;

  switch (eventType) {
    case "payment_intent.succeeded":
      const paymentIntent = eventDataObject;
      console.log("PaymentIntent was successful!", paymentIntent);
      break;
    case "payment_method.attached":
      const paymentMethod = eventDataObject;
      console.log("PaymentMethod was attached to a Customer!", paymentMethod);
      break;
    case "setup_intent.succeeded":
      const setupIntent = eventDataObject;
      console.log("setup_intent was attached to a Customer!", setupIntent);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${eventType}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
};
