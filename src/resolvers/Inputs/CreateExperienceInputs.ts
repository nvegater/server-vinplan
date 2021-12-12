import { Field, Float, InputType } from "type-graphql";
import { ExperienceType } from "../../entities/Experience";
import { SlotType } from "../../entities/ExperienceSlot";

// https://typegraphql.com/docs/0.16.0/scalars.html
// default is ISO format ("isoDate") - "2018-02-07T21:04:39.573Z"
@InputType()
export class CreateRecurrentDatesInputs {
  @Field(() => Date)
  startDate!: Date;
  @Field(() => Date)
  endDate!: Date;
  @Field()
  durationInMinutes!: number;
  @Field(() => SlotType)
  slotType!: SlotType;
  @Field(() => [Date], { nullable: true })
  customDates?: Date[];
  @Field(() => [Date], { nullable: true })
  exceptions?: Date[];
  //   export type WeekStart = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA';
  @Field(() => [String], { nullable: true })
  exceptionDays?: string[];
}

@InputType()
export class CreateExperienceInputs {
  @Field()
  wineryId!: number;
  @Field()
  title!: string;
  @Field()
  description!: string;
  @Field()
  limitOfAttendees!: number;
  @Field(() => ExperienceType)
  typeOfEvent!: ExperienceType;
  @Field(() => Float)
  pricePerPersonInDollars: number;
}
