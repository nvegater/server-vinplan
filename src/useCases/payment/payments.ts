import {
  createCheckoutSession_DS,
  createCustomer_DS,
  getCheckoutSession_DS,
  getProductIds_DS,
  retrievePriceFromProduct_DS,
} from "../../dataServices/payment";
import {
  CheckoutSessionResponse,
  CustomerResponse,
  ProductsResponse,
} from "../../resolvers/Outputs/PaymentOutputs";
import {
  CreateCustomerInputs,
  PaymentMetadataInputs,
} from "../../resolvers/Inputs/CreateCustomerInputs";

export const getProductIds = async (): Promise<ProductsResponse> => {
  const stripe_productsIds = await getProductIds_DS();
  return {
    productIds: stripe_productsIds,
  };
};

export const verifyCheckoutSessionStatus = async (
  sessionId: string
): Promise<CheckoutSessionResponse> => {
  const session = await getCheckoutSession_DS(sessionId);

  return session.status
    ? { sessionStatus: session.status }
    : {
        errors: [
          { field: "checkout", message: "Cant retrieve session status" },
        ],
      };
};

export const createCustomer = async (
  createCustomerInputs: CreateCustomerInputs
): Promise<CustomerResponse> => {
  const stripe_customer = await createCustomer_DS({
    email: createCustomerInputs.email,
    metadata: { username: createCustomerInputs.paymentMetadata.username },
  });
  const paymentMetadata: PaymentMetadataInputs = {
    username: stripe_customer.metadata.username,
  };
  return {
    customer: {
      email: createCustomerInputs.email,
      paymentMetadata: paymentMetadata,
    },
  };
};

export const createSubscriptionCheckoutSession = async (
  successUrl: string,
  cancelUrl: string,
  productId: string
): Promise<CheckoutSessionResponse> => {
  const price = await retrievePriceFromProduct_DS(productId);

  const stripe_checkoutSessionId = await createCheckoutSession_DS({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: price.id,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
  });

  return stripe_checkoutSessionId.url
    ? { sessionUrl: stripe_checkoutSessionId.url }
    : {
        errors: [
          { field: "checkout", message: "Url not available for this checkout" },
        ],
      };
};
