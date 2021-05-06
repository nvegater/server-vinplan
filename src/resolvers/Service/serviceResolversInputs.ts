import {Field, Float, InputType} from "type-graphql";
import {EventType} from "../../entities/Service";

@InputType()
export class CreateServiceInputs {
    @Field()
    wineryId!: number;
    @Field()
    limitOfAttendees!: number;
    @Field()
    duration!: number;
    @Field()
    title!: string
    @Field()
    description!: string
    @Field(() => EventType)
    eventType!: EventType;
    @Field(() => Float)
    pricePerPersonInDollars: number;
    @Field(() => Date)
    startDateTime!: Date;
    @Field(() => Date)
    endDateTime!: Date;
    @Field(() => [String], {nullable: true})
    rRules: string[];
}

@InputType()
export class ReserveServiceInputs {
    @Field()
    serviceId: number;
    @Field()
    noOfAttendees: number;
    @Field()
    startDateTime: Date;
    @Field()
    paypalOrderId: string;
    @Field()
    status: string;
    @Field()
    paymentCreationDateTime: string;
    @Field(() => Float)
    pricePerPersonInDollars: number;
}


@InputType()
export class UpdateServiceInputs {
    @Field()
    id!: number
    @Field()
    title!: string
    @Field()
    description!: string
    @Field(() => EventType)
    eventType!: EventType;

    @Field(() => Float)
    pricePerPersonInDollars: number;

    @Field(() => Date,)
    startDateTime!: Date;
    @Field(() => Date, {nullable: true})
    endDateTime?: Date;

}