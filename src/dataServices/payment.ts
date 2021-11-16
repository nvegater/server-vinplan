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
