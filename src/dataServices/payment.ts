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

export const getProductByName_DS = async (name: string) => {
  const productList: Stripe.ApiList<Stripe.Product> =
    await stripe.products.list();

  return productList.data.filter((product) => product.name === name);
};

export const getProducts_DS = async () => {
  const productList: Stripe.ApiList<Stripe.Product> =
    await stripe.products.list();

  return productList.data;
};

export const retrievePricesFromProduct_DS = async (productId: string) => {
  const pricesList = await stripe.prices.list({
    expand: ["data.product"],
  });
  // Safe to expand the product
  return pricesList.data.filter(
    (price) =>
      (price.product as Stripe.Product).active &&
      (price.product as Stripe.Product).id === productId
  );
};

export const getFirstSubscription = async (customerId: string) => {
  const allSubscriptions = await stripe.subscriptions.list({
    customer: customerId,
  });
  return allSubscriptions.data[0];
};

export const retrievePricesWithTiers_DS = async (productId: string) => {
  // Safe to expand the product
  const pricesList = await stripe.prices.list({
    expand: ["data.tiers", "data.product"],
  });
  return pricesList.data.filter(
    (price) =>
      (price.product as Stripe.Product).active &&
      (price.product as Stripe.Product).id === productId
  );
};

export const createAccountForExpressOnboarding_DS = async (email: string) => {
  return await stripe.accounts.create({
    type: "express",
    email: email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
};

export const accountLinkForOnboarding_DS = async (
  accountId: string,
  wineryAlias: string
) => {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `http://localhost:3000/winery/${wineryAlias}`,
    return_url: `http://localhost:3000/winery/${wineryAlias}`,
    type: "account_onboarding",
  });
  return accountLink.url;
};
// Match the raw body to content type application/json
export const webhookListenerFn = async (request: any, response: any) => {
  const sig = request.headers["stripe-signature"];
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
