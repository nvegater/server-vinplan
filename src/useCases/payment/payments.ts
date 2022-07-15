import {
  accountLinkForOnboarding_DS,
  createAccountForExpressOnboarding_DS,
  createCheckoutSession_DS,
  createCustomer_stripe,
  getCheckoutSession_DS,
  getFirstSubscription,
  getProducts_DS,
  retrievePricesWithTiers_DS,
} from "../../dataServices/payment";
import {
  CheckoutLinkResponse,
  CheckoutSessionResponse,
  CustomerReservationResponse,
  CustomerResponse,
  OnboardingResponse,
  ProductsResponse,
} from "../../resolvers/Outputs/PaymentOutputs";
import { CreateCustomerInputs } from "../../resolvers/Inputs/CreateCustomerInputs";
import { Product } from "../../entities/Product";
import { Price } from "../../entities/Price";
import {
  getWineryByAlias_DS,
  getWineryNameByExperienceId,
  updateWineryAccountID_DS,
} from "../../dataServices/winery";
import { customError } from "../../resolvers/Outputs/ErrorOutputs";
import { Winery } from "../../entities/Winery";
import {
  getSlotsByIds,
  updateSlotVisitors,
} from "../../dataServices/experience";
import {
  createCustomer_DS,
  getCustomerByEmail,
} from "../../dataServices/customer";
import {
  confirmReservationPayment,
  createReservation,
  reservationsByEmail,
} from "../../dataServices/reservation";
import { Reservation } from "../../entities/Reservation";
import { ExperienceSlot } from "../../entities/ExperienceSlot";
import { getWineryImageGetURL } from "../../dataServices/s3Utilities";
import { getExperienceCoverImageDB } from "../../dataServices/pictures";
import { ReservationDts } from "../../resolvers/ReservationResolvers";

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

export const retrieveCustomerReservations = async (
  email: string
): Promise<CustomerReservationResponse> => {
  const reservations = await reservationsByEmail(email);

  if (reservations == null) {
    return customError("reservations", "Error getting customer reservations");
  }

  const resWithImages: ReservationDts[] = await Promise.all(
    reservations.map(async (cr) => {
      const coverImage = await getExperienceCoverImageDB(cr.experienceId);
      const wineryAlias = coverImage?.experience.winery.urlAlias;
      return {
        ...cr,
        getUrl:
          coverImage && wineryAlias
            ? getWineryImageGetURL(coverImage.imageName, wineryAlias)
            : undefined,
      };
    })
  );

  const resSortedWithImages = resWithImages.sort(
    (a, b) => a.startDateTime.getTime() - b.startDateTime.getTime()
  );

  return { reservations: resSortedWithImages };
};

// use this as guide

export const verifyCheckoutSessionStatus = async (
  sessionId: string
): Promise<CheckoutSessionResponse> => {
  const session = await getCheckoutSession_DS(sessionId);

  if (session.metadata == null) {
    return customError("stripeMetadata", "The session contains no metadata");
  }

  if (session.payment_status === "unpaid") {
    return {
      payment_status: "unpaid",
    };
  }

  let reservationIds: number[] = [];
  for (const [, value] of Object.entries(session.metadata)) {
    reservationIds.push(parseInt(value as string));
  }

  if (reservationIds.length === 0) {
    return customError(
      "stripeMetadata",
      "There is something wrong with the metadata"
    );
  }

  const confirmedReservations = await confirmReservationPayment(reservationIds);

  let confirmedSlots: ExperienceSlot[] = [];
  try {
    confirmedSlots = await Promise.all(
      confirmedReservations.map(async (confRes) => {
        return await updateSlotVisitors(confRes.noOfAttendees, confRes.slotId);
      })
    );
  } catch (e) {
    console.log(e);
  }

  if (confirmedSlots.length === 0) {
    return customError(
      "reservation",
      "We couldnt confirm the slots of your reservation"
    );
  }

  const toDts: ReservationDts[] = await Promise.all(
    confirmedReservations.map(async (cr) => {
      const coverImage = await getExperienceCoverImageDB(cr.experienceId);
      const wineryAlias = coverImage?.experience.winery.urlAlias;
      return {
        ...cr,
        getUrl:
          coverImage && wineryAlias
            ? getWineryImageGetURL(coverImage.imageName, wineryAlias)
            : undefined,
      };
    })
  );

  if (toDts.length === 0) {
    return customError("reservation", "We couldnt confirm your reservation");
  }

  return session.status
    ? {
        reservations: toDts,
        payment_status: "paid",
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

async function createStripeCustomerAndPersistInWenoDB(
  createCustomerInputs: CreateCustomerInputs
) {
  const stripe_customer = await createCustomer_stripe({
    email: createCustomerInputs.email,
    metadata: createCustomerInputs.paymentMetadata
      ? { username: createCustomerInputs.paymentMetadata.username }
      : null,
  });

  console.log(stripe_customer)

  return await createCustomer_DS({
    stripeCustomerId: stripe_customer.id,
    email: stripe_customer.email as string,
    username: createCustomerInputs.paymentMetadata
      ? createCustomerInputs.paymentMetadata.username
      : null,
  });
}

// force the creation of the customer if there is not an existing one
export const getExistingCustomer = async (
  createCustomerInputs: CreateCustomerInputs
): Promise<CustomerResponse> => {
  const existingCustomer = await getCustomerByEmail(createCustomerInputs.email);
  if (existingCustomer) {
    return { customer: existingCustomer };
  }

  const weno_customer = await createStripeCustomerAndPersistInWenoDB(
    createCustomerInputs
  );

  return { customer: weno_customer };
};

export const createCustomer = async (
  createCustomerInputs: CreateCustomerInputs
): Promise<CustomerResponse> => {
  const existingCustomer = await getCustomerByEmail(createCustomerInputs.email);

  if (existingCustomer) {
    return customError("customer", "Already exists");
  }

  const weno_customer = await createStripeCustomerAndPersistInWenoDB(
    createCustomerInputs
  );

  return {
    customer: { ...weno_customer },
  };
};

interface SlotPaymentLinkInputs {
  createCustomerInputs: CreateCustomerInputs;
  slotIds: number[];
  noOfVisitors: number;
  successUrl: string;
  cancelUrl: string;
}

function createLineItems(reservations: Reservation[], noOfVisitors: number) {
  return reservations.map((reservation) => ({
    price_data: {
      currency: "MXN",
      unit_amount: reservation.pricePerPersonInDollars * 100, // convert from centavos to pesos
      product_data: {
        name: reservation.title,
        description: "A reservation for the event",
        // add images?
      },
    },
    quantity: noOfVisitors,
  }));
}

function reservationMetadataKey(index: number) {
  return `resId-${index}`;
}

function createPaymentMetadata(reservations: Reservation[]): {
  [key: string]: number;
} {
  let metadata: { [key: string]: number } = {};
  reservations.forEach((res, index) => {
    const key = reservationMetadataKey(index);
    metadata[key] = res.id;
  });
  return metadata;
}

export const generatePaymentLinkForReservation = async ({
  createCustomerInputs,
  slotIds,
  noOfVisitors,
  successUrl,
  cancelUrl,
}: SlotPaymentLinkInputs): Promise<CheckoutLinkResponse> => {
  const existingCustomer = await getCustomerByEmail(createCustomerInputs.email);

  // Create Customer if needed
  const weno_customer =
    existingCustomer == null
      ? await createStripeCustomerAndPersistInWenoDB(createCustomerInputs)
      : existingCustomer;

  const slots = await getSlotsByIds(slotIds);

  if (slots == null || slots.length === 0) {
    return customError("slot", "couldnt find a slot with that Id");
  }

  // Create unpaid reservations for each selected slot.
  const reservations = await Promise.all(
    slots.map(async (slot) => {
      const wineryName = await getWineryNameByExperienceId(slot.experienceId);
      return await createReservation({
        slotId: slot.id,
        startDateTime: slot.startDateTime,
        endDateTime: slot.endDateTime,
        pricePerPersonInDollars: slot.pricePerPersonInDollars,
        title: slot.experience.title,
        username: weno_customer.username ?? null,
        email: weno_customer.email,
        noOfAttendees: noOfVisitors,
        paymentStatus: "unpaid",
        wineryName: wineryName!,
        experienceId: slot.experienceId,
      });
    })
  );

  // Create a line item for each reservation
  const lineItems = createLineItems(reservations, noOfVisitors);

  const sessionMetadata = createPaymentMetadata(reservations);

  const stripe_checkoutSessionId = await createCheckoutSession_DS({
    mode: "payment",
    customer: weno_customer.stripeCustomerId,
    metadata: { ...sessionMetadata },
    payment_method_types: ["card"],
    line_items: lineItems,
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
