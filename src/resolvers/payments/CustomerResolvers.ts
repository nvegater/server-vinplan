import { Arg, Authorized, Mutation, Resolver } from "type-graphql";

import { Customer } from "../../entities/Customer";
import { CustomerResponse } from "../Outputs/CustomerOutputs";
import { CreateCustomerInputs } from "../Inputs/CreateCustomerInputs";

import { createCustomer } from "../../useCases/payment/createCustomer";

@Resolver(Customer)
export class CustomerResolvers {
  @Authorized()
  @Mutation(() => CustomerResponse)
  async createCustomer(
    @Arg("createCustomerInputs") createCustomerInputs: CreateCustomerInputs
  ): Promise<CustomerResponse> {
    return await createCustomer({ ...createCustomerInputs });
  }
}
