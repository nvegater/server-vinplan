import {Field, Float, InputType} from "type-graphql";
import {EventType} from "../../entities/Service";

@InputType()
export class CreateServiceInputs {
    @Field()
    wineryId!: number;

    @Field()
    title!: string
    @Field()
    description!: string
    @Field(() => EventType)
    eventType!: EventType;

    @Field(() => Float)
    pricePerPersonInDollars: number;

    @Field(() => Date)
    startDate!: Date;
    @Field(() => Date,{nullable:true})
    endDate?: Date;

    @Field(() => Date)
    startTime!: Date;
    @Field(() => Date)
    endTime!: Date;

}

@InputType()
export class UpdateServiceInputs {
    @Field()
    id!: number
    @Field()
    wineryId!: number;
    @Field()
    title!: string
    @Field()
    description!: string
    @Field(() => EventType)
    eventType!: EventType;

    @Field(() => Float)
    pricePerPersonInDollars: number;

    @Field(() => Date)
    startDate!: Date;
    @Field(() => Date,{nullable:true})
    endDate?: Date;

    @Field(() => Date)
    startTime!: Date;
    @Field(() => Date)
    endTime!: Date;

}