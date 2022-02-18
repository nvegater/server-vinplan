import { Customer } from "../entities/Customer";

export const getCustomerByEmail = async (email: string) => {
  return await Customer.findOne({ where: { email } });
};

interface CreateCustomerInputs {
  stripeCustomerId: string;
  email: string;
  username: string | null;
}

export const createCustomer_DS = async (props: CreateCustomerInputs) => {
  const customer = Customer.create({ ...props });
  await customer.save();
  return customer;
};
