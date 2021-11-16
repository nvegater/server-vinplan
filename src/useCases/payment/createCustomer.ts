import {
  CreateCustomerInputs,
  PaymentMetadataInputs,
} from "../../resolvers/Inputs/CreateCustomerInputs";
import { CustomerResponse } from "../../resolvers/Outputs/CustomerOutputs";
import { createCustomer_DS } from "../../dataServices/payment";

export const createCustomer = async (
  createCustomerInputs: CreateCustomerInputs
): Promise<CustomerResponse> => {
  const stripe_customer = await createCustomer_DS({ ...createCustomerInputs });
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
