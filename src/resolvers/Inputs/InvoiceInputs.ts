import { Field, Float, InputType } from "type-graphql";

@InputType()
export class InvoiceProduct {
  @Field(() => String)
  description!: string;
  @Field(() => Float)
  price: number;
  @Field(() => String)
  productKey: string;
}

@InputType()
export class InvoiceItem {
  @Field(() => InvoiceProduct)
  product: InvoiceProduct;
}

@InputType()
export class CreateInvoiceInputs {
  @Field(() => String)
  legalName: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  taxId: string;
  @Field(() => String)
  taxSystem: string;
  @Field(() => String)
  zip: string;
  @Field(() => [InvoiceItem])
  items: InvoiceItem[];
  @Field(() => String)
  use: string;
  @Field(() => String)
  paymentForm: string;
}
