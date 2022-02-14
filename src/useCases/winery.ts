import { GetWineryInputs, UserInputs } from "../resolvers/Inputs/UserInputs";
import {
  CreateWineryInputs,
  EditWineryInputs,
} from "../resolvers/Inputs/CreateWineryInputs";
import { WineryDts, WineryResponse } from "../resolvers/Outputs/WineryOutputs";
import { Winery } from "../entities/Winery";
import {
  createWinery_DS,
  editWineryDb,
  getAllWineriesNames,
  getWineryByAlias_DS,
  getWineryByUsername_DS,
  updateWineryAccountCreationTime,
} from "../dataServices/winery";
import {
  createCheckoutSession_DS,
  createCustomer_stripe,
  getConnectedAccountById,
  getProductByName_DS,
  retrievePricesFromProduct_DS,
} from "../dataServices/payment";
import { customError } from "../resolvers/Outputs/ErrorOutputs";

export const mapWineryToDts = (winery: Winery): WineryDts => ({
  ...winery,
  wineType: winery.wineType ? winery.wineType.map((w) => w.wineType) : [],
  productionType: winery.productionType
    ? winery.productionType.map((w) => w.productionType)
    : [],
  supportedLanguages: winery.supportedLanguages
    ? winery.supportedLanguages?.map((w) => w.supportedLanguage)
    : [],
  amenities: winery.amenities ? winery.amenities?.map((w) => w.amenity) : [],
});

export const editWinery = async (
  inputs: EditWineryInputs
): Promise<WineryResponse> => {
  const updatedWinery = await editWineryDb(inputs);

  if (updatedWinery == null) {
    return customError("editWinery", "Error Editing winery");
  }

  return { winery: mapWineryToDts(updatedWinery) };
};

export const getWineriesNames = async () => {
  return await getAllWineriesNames();
};

interface CreateWineryHookProps {
  winery: CreateWineryInputs;
  user: UserInputs;
}

export const createWinery = async ({
  winery,
  user,
}: CreateWineryHookProps): Promise<WineryResponse> => {
  const stripe_customer = await createCustomer_stripe({
    email: user.email,
    metadata: { username: user.username },
  });
  await createWinery_DS({
    wineryInputs: winery,
    user,
    stripeCustomerId: stripe_customer.id,
  });

  const product = await getProductByName_DS(winery.subscription);

  if (product.length > 1) {
    return {
      errors: [{ field: "winery", message: "Multiple products found" }],
    };
  }

  if (!Boolean(product)) {
    return {
      errors: [
        {
          field: "winery",
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
    ? { sessionUrl: stripe_checkoutSessionId.url }
    : {
        errors: [
          { field: "checkout", message: "Url not available for this checkout" },
        ],
      };
};

export const getWinery = async ({
  urlAlias,
  creatorUsername,
}: GetWineryInputs): Promise<WineryResponse> => {
  const winery: Winery | undefined | null = urlAlias
    ? await getWineryByAlias_DS(urlAlias)
    : creatorUsername
    ? await getWineryByUsername_DS(creatorUsername)
    : null;

  if (winery == null) {
    return customError("winery", "Not found");
  }

  const wineryDts = {
    ...winery,
    wineType: winery.wineType.map((w) => w.wineType),
    productionType: winery.productionType.map((w) => w.productionType),
    supportedLanguages: winery.supportedLanguages?.map(
      (w) => w.supportedLanguage
    ),
    amenities: winery.amenities?.map((w) => w.amenity),
  };

  return { winery: wineryDts };
};

export const confirmConnectedAccountCreation = async (
  wineryAlias: string
): Promise<WineryResponse> => {
  const winery = await getWineryByAlias_DS(wineryAlias);

  if (winery == null) {
    return customError("winery", "couldnt find a winery with that alias");
  }

  if (winery.accountId == null) {
    return customError("winery", "The account id for this winery is not set");
  }

  const account = await getConnectedAccountById(winery.accountId);

  if (account == null) {
    return customError("winery", "couldnt retrieve an account");
  }

  if (account.created == null) {
    return customError("winery", "account has not yet been created");
  }

  const updatedWinery =
    winery.accountCreatedTime === -1
      ? await updateWineryAccountCreationTime(wineryAlias, account.created)
      : winery;

  return { winery: mapWineryToDts(updatedWinery) };
};
