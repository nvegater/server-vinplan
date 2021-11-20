import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Customer } from "../entities/Customer";
import {
  CheckoutSessionResponse,
  CustomerResponse,
  ProductsResponse,
} from "./Outputs/PaymentOutputs";
import { CreateCustomerInputs } from "./Inputs/CreateCustomerInputs";

import {
  createSubscriptionCheckoutSession,
  verifyCheckoutSessionStatus,
  createCustomer,
  retrieveSubscriptionsWithPrices,
} from "../useCases/payment/payments";

/**
 * The order is more or less like this:
 * 1. Get the products to display them in the frontend
 * 2. The user choose a product in the frontend.
 * 3. Sends the Product ID to the backend and the urls to retrieve a checkout Link
 * 4. The user pays via the checkout Link and triggers setup_intent.succeeded
 * 5. Provision the prduct after checking that the status is active and show Succesfull payment screen (Dashboard)
 * */
@Resolver(Customer)
export class PaymentsResolvers {
  @Authorized()
  @Mutation(() => CustomerResponse)
  async createCustomer(
    @Arg("createCustomerInputs") createCustomerInputs: CreateCustomerInputs
  ): Promise<CustomerResponse> {
    return await createCustomer({ ...createCustomerInputs });
  }

  @Query(() => ProductsResponse)
  async getSubscriptionProducts(): Promise<ProductsResponse> {
    return await retrieveSubscriptionsWithPrices();
  }

  @Authorized()
  @Mutation(() => CheckoutSessionResponse)
  async getCheckoutSessionStatus(
    @Arg("sessionId") sessionId: string
  ): Promise<CheckoutSessionResponse> {
    return await verifyCheckoutSessionStatus(sessionId);
  }

  @Mutation(() => CheckoutSessionResponse)
  async getCheckoutSessionForSubscription(
    @Arg("successUrl") successUrl: string,
    @Arg("cancelUrl") cancelUrl: string,
    @Arg("productId") productId: string
  ): Promise<CheckoutSessionResponse> {
    return await createSubscriptionCheckoutSession(
      successUrl,
      cancelUrl,
      productId
    );
  }
}
