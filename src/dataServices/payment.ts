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
