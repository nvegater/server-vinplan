import { Arg, Authorized, Resolver } from "type-graphql";
import { Invoice, InvoiceResponse } from "./Outputs/InvoiceOutputs";
import { CreateInvoiceInputs } from "./Inputs/InvoiceInputs";
import { createInvoice } from "../useCases/invoices";

@Resolver(Invoice)
export class InvoiceResolvers {
  @Authorized("owner")
  generateInvoice(
    @Arg("createInvoiceInputs")
    createInvoiceInputs: CreateInvoiceInputs
  ): Promise<InvoiceResponse> {
    return createInvoice(createInvoiceInputs);
  }
}
