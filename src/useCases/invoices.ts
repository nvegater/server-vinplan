import { createInvoiceDB } from "../dataServices/invoices";
import { CreateInvoiceInputs } from "../resolvers/Inputs/InvoiceInputs";

export const createInvoice = async (
  createInvoiceInputs: CreateInvoiceInputs
) => {
  return createInvoiceDB({
    ...createInvoiceInputs,
    items: createInvoiceInputs.items,
    paymentForm: createInvoiceInputs.paymentForm,
  });
};
