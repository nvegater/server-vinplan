import { Field, ObjectType } from "type-graphql";

@ObjectType({
  description: "https://docs.facturapi.io/api/#operation/createInvoice",
})
export class Invoice {
  @Field(() => String)
  id: string;
  @Field(() => String)
  created_at: string;
  @Field(() => Boolean)
  livemode: boolean;
  @Field(() => String)
  status: string;
  @Field(() => String)
  cancellation_status: string;
  @Field(() => String)
  verification_url: string;
  @Field(() => String)
  cancellation_receipt: string;
  @Field(() => String)
  type: string;
}
@ObjectType()
export class InvoiceError {
  @Field(() => String)
  message: string;
}

@ObjectType()
export class InvoiceResponse {
  invoice?: Invoice;
  error?: InvoiceError;
}
