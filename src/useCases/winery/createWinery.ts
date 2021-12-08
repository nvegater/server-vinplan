import { GetWineryInputs, UserInputs } from "../../resolvers/Inputs/UserInputs";
import CreateWineryInputs from "../../resolvers/Inputs/CreateWineryInputs";
import { WineryResponse } from "../../resolvers/Outputs/WineryOutputs";
import { Winery } from "../../entities/Winery";
import {
  createWinery_DS,
  getWineryByAlias_DS,
  getWineryByUsername_DS,
} from "../../dataServices/winery";
import {
  createCheckoutSession_DS,
  createCustomer_DS,
  getProductByName_DS,
  retrievePricesFromProduct_DS,
} from "../../dataServices/payment";

interface CreateWineryHookProps {
  winery: CreateWineryInputs;
  user: UserInputs;
}

type CreateWineryHookResult = Promise<WineryResponse>;

type CreateWineryHook = (
  props: CreateWineryHookProps
) => CreateWineryHookResult;

export const createWinery: CreateWineryHook = async ({ winery, user }) => {
  const stripe_customer = await createCustomer_DS({
    email: user.email,
    metadata: { username: user.username },
  });
  const createdWinery = await createWinery_DS({
    winery,
    user,
    stripeCustomerId: stripe_customer.id,
  });

  const product = await getProductByName_DS(winery.subscription);

  if (product.length > 1) {
    return {
      errors: [{ field: "createWinery", message: "Multiple products found" }],
    };
  }

  if (!Boolean(product)) {
    return {
      errors: [
        {
          field: "createWinery",
          message: "Error retrieving subscription products",
        },
      ],
    };
  }
  const prices = await retrievePricesFromProduct_DS(product[0].id);

  const stripe_checkoutSessionId = await createCheckoutSession_DS({
    mode: "subscription",
    customer: stripe_customer.id,
    payment_method_types: ["card"],
    line_items: prices.map((price) => {
      return {
        price: price.id,
        quantity: price.recurring?.usage_type === "metered" ? undefined : 1,
      };
    }),
    success_url: `${user.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: user.cancelUrl,
  });

  return stripe_checkoutSessionId.url
    ? { sessionUrl: stripe_checkoutSessionId.url, winery: createdWinery }
    : {
        errors: [
          { field: "checkout", message: "Url not available for this checkout" },
        ],
      };
};

export const getWinery = async ({
  urlAlias,
  creatorUsername,
}: GetWineryInputs) => {
  const winery: Winery | undefined | null = urlAlias
    ? await getWineryByAlias_DS(urlAlias)
    : creatorUsername
    ? await getWineryByUsername_DS(creatorUsername)
    : null;

  if (winery === null) {
    return {
      errors: [
        { message: "Provide a username or a url alias", field: "winery" },
      ],
    };
  }

  if (winery === undefined) {
    return { errors: [{ message: "Not found", field: "winery" }] };
  }
  return { winery: winery };
};