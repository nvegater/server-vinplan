import {
  createCheckoutSession_DS,
  getProductIds_DS,
  retrievePriceFromProduct,
} from "../../dataServices/payment";
import { ProductsResponse } from "../../resolvers/Outputs/ProductOutputs";

export const getProductIds = async (): Promise<ProductsResponse> => {
  const stripe_productsIds = await getProductIds_DS();
  return {
    productIds: stripe_productsIds,
  };
};

export const testUrlSuccess =
  "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}";
export const subscription_createCheckoutSession = async (
  successUrl: string,
  cancelUrl: string,
  productId: string
): Promise<string> => {
  const price = await retrievePriceFromProduct(productId);

  const stripe_checkoutSessionId = await createCheckoutSession_DS({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: price.id,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
  });

  return stripe_checkoutSessionId.url
    ? stripe_checkoutSessionId.url
    : cancelUrl;
};
