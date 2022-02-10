import { Field, Float, Int, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorOutputs";
import { Product } from "../../entities/Product";

@ObjectType()
export class ProductsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [Product], { nullable: true })
  products?: Product[];
}

@ObjectType()
export class CustomerDts {
  @Field()
  id: string;
  @Field()
  stripeCustomerId: string;
  @Field()
  email: string;
  @Field(() => String, {
    nullable: true,
  })
  username: string | null;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class CustomerResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => CustomerDts, { nullable: true })
  customer?: CustomerDts;
}

@ObjectType()
export class ReservationDts {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  title: string;
  @Field(() => String)
  email: string;
  @Field(() => String, { nullable: true })
  username: string | null;
  @Field(() => Int)
  noOfAttendees!: number;
  @Field(() => Float)
  pricePerPersonInDollars!: number;
  @Field()
  paymentStatus: "no_payment_required" | "paid" | "unpaid";
  @Field(() => Int)
  slotId: number;
  @Field(() => Date)
  startDateTime: Date;
  @Field(() => Date)
  endDateTime: Date;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Field(() => String)
  wineryName: string;
  @Field(() => String, { nullable: true })
  getUrl?: string;
}

@ObjectType()
export class CustomerReservationResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [ReservationDts], { nullable: true })
  reservations?: ReservationDts[];
}

@ObjectType()
export class CheckoutSessionResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => String, { nullable: true })
  sessionUrl?: string | null;
  @Field(() => [ReservationDts], { nullable: true })
  reservations?: ReservationDts[];
  @Field(() => String, { nullable: true })
  payment_status?: "no_payment_required" | "paid" | "unpaid" | null;
}

@ObjectType()
export class CheckoutLinkResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => String, { nullable: true })
  link?: string | null;
}

@ObjectType()
export class OnboardingResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => String, { nullable: true })
  accountLinkUrl?: string;
}
