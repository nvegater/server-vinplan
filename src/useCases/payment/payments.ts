import {
  accountLinkForOnboarding_DS,
  createAccountForExpressOnboarding_DS,
  createCheckoutSession_DS,
  createCustomer_DS,
  getCheckoutSession_DS,
  getFirstSubscription,
  getProducts_DS,
  retrievePricesWithTiers_DS,
} from "../../dataServices/payment";
import {
  CheckoutLinkResponse,
  CheckoutSessionResponse,
  CustomerResponse,
  OnboardingResponse,
  ProductsResponse,
} from "../../resolvers/Outputs/PaymentOutputs";
import { CreateCustomerInputs } from "../../resolvers/Inputs/CreateCustomerInputs";
import { Product } from "../../entities/Product";
import { Price } from "../../entities/Price";
import {
  getWineryByAlias_DS,
  updateWineryAccountID_DS,
} from "../../dataServices/winery";
import { customError } from "../../resolvers/Outputs/ErrorOutputs";
import { Winery } from "../../entities/Winery";
import { getSlotById } from "../../dataServices/experience";

export const retrieveSubscriptionsWithPrices =
  async (): Promise<ProductsResponse> => {
    const stripe_products = await getProducts_DS();

    const activeProducts = stripe_products.filter((prod) => prod.active); // only active products

    let productsWithPrice: Product[] = [];

    try {
      productsWithPrice = await Promise.all(
        activeProducts.map(async (prod) => {
          const prices = await retrievePricesWithTiers_DS(prod.id);
          const pricesModels: Price[] = prices.map((price) => {
            const priceModel: Price = {
              currency: price.currency,
              tiersMode: price.tiers_mode,
              type: price.type,
              id: price.id,
              tiers: price.tiers,
              unitAmount: price.unit_amount,
              unitAmountDecimal: price.unit_amount_decimal,
            };
            return priceModel;
          });
          const product: Product = {
            id: prod.id,
            name: prod.name,
            description: prod.description ? prod.description : "",
            images: prod.images,
            unit_label: prod.unit_label ? prod.unit_label : "",
            price: pricesModels,
          };
          return product;
        })
      );
    } catch (e) {
      throw new Error(e);
    }

    if (productsWithPrice.length === 0)
      return {
        errors: [
          { field: "product", message: "couldnt retrieve product info" },
        ],
      };

    return {
      products: productsWithPrice,
    };
  };

export const verifyCheckoutSessionStatus = async (
  sessionId: string
): Promise<CheckoutSessionResponse> => {
  const session = await getCheckoutSession_DS(sessionId);

  return session.status
    ? {
        sessionStatus: session.status,
        sessionUrl: session.url,
      }
    : {
        errors: [
          { field: "checkout", message: "Cant retrieve session status" },
        ],
      };
};

export const getCustomerSubscription = async (customerId: string) => {
  const firstSubscription = await getFirstSubscription(customerId);
  return firstSubscription.status;
};

export const createCustomer = async (
  createCustomerInputs: CreateCustomerInputs
): Promise<CustomerResponse> => {
  const stripe_customer = await createCustomer_DS({
    email: createCustomerInputs.email,
    metadata: createCustomerInputs.paymentMetadata
      ? { username: createCustomerInputs.paymentMetadata.username }
      : null,
  });

  if (stripe_customer.email == null) {
    return customError("email", "This should be impossible");
  }

  if (stripe_customer.metadata == null) {
    return {
      customer: {
        id: stripe_customer.id,
        email: stripe_customer.email,
        paymentMetadata: null,
      },
    };
  }

  if (stripe_customer.metadata.username == null) {
    return customError("username", "Created customer without user");
  }

  return {
    customer: {
      id: stripe_customer.id,
      email: stripe_customer.email,
      paymentMetadata: { username: stripe_customer.metadata.username },
    },
  };
};

interface SlotPaymentLinkInputs {
  createCustomerInputs: CreateCustomerInputs;
  slotId: number;
  noOfVisitors: number;
  successUrl: string;
  cancelUrl: string;
}

export const generatePaymentLinkForSlot = async ({
  createCustomerInputs,
  slotId,
  noOfVisitors,
  successUrl,
  cancelUrl,
}: SlotPaymentLinkInputs): Promise<CheckoutLinkResponse> => {
  // Create Customer
  const stripe_customer = await createCustomer_DS({
    email: createCustomerInputs.email,
    metadata: createCustomerInputs.paymentMetadata
      ? { username: createCustomerInputs.paymentMetadata.username }
      : null,
  });

  if (stripe_customer.email == null) {
    return customError("email", "This should be impossible");
  }
  const slot = await getSlotById(slotId);

  if (slot == null) {
    return customError("slot", "couldnt find a slot with that Id");
  }

  const stripe_checkoutSessionId = await createCheckoutSession_DS({
    mode: "payment",
    customer: stripe_customer.id,
    customer_email: stripe_customer.email,
    metadata: stripe_customer.metadata,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "MXN",
          unit_amount: slot.pricePerPersonInDollars,
          product_data: {
            name: slot.experience.title,
            description: "A reservation for the event.",
            metadata: {
              startDateTime: slot.startDateTime.toISOString(),
              endDateTime: slot.endDateTime.toISOString(),
            },
            // add images?
          },
        },
        quantity: noOfVisitors,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
  });

  return { link: stripe_checkoutSessionId.url };
};

export const onboardingUrlLink = async (
  wineryAlias: string
): Promise<OnboardingResponse> => {
  const winery = await getWineryByAlias_DS(wineryAlias);

  if (winery == null) {
    return customError("winery", "winery not found");
  }

  const updatedWinery =
    winery.accountId == null ? await generateAccountLinkURL(winery) : undefined;

  const accountId = updatedWinery
    ? updatedWinery!.accountId!
    : winery!.accountId!;

  const accountLinkUrl = await accountLinkForOnboarding_DS(
    accountId,
    wineryAlias
  );

  if (accountLinkUrl == null) {
    return customError("account", "couldnt Generate account Link");
  }

  return { accountLinkUrl };
};

const generateAccountLinkURL = async (
  winery: Winery
): Promise<Winery | undefined> => {
  const account = await createAccountForExpressOnboarding_DS(
    winery.creatorEmail
  );

  if (account == null) {
    return undefined;
  }

  const updatedWinery = await updateWineryAccountID_DS(
    account.id,
    winery.urlAlias
  );

  if (updatedWinery == null) {
    return undefined;
  }
  return updatedWinery;
};
