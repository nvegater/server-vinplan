import {
  accountLinkForOnboarding_DS,
  createAccountForExpressOnboarding_DS,
  createCustomer_DS,
  getCheckoutSession_DS,
  getFirstSubscription,
  getProducts_DS,
  retrievePricesWithTiers_DS,
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
import { Product } from "../../entities/Product";
import { Price } from "../../entities/Price";
import { getWineryByAlias_DS } from "../../dataServices/winery";

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

export const initiateOnboardingForConnectedAccount = async (
  wineryAlias: string
) => {
  const winery = await getWineryByAlias_DS(wineryAlias);
  if (winery?.subscription === null || winery?.subscription === undefined)
    return {
      errors: [
        { field: "subscription", message: "Winery has no active subscription" },
      ],
    };
  const account = await createAccountForExpressOnboarding_DS(
    winery.creatorEmail
  );

  return await accountLinkForOnboarding_DS(account.id, wineryAlias);
};
