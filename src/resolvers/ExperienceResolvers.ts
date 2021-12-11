import {
  Arg,
  Field,
  InputType,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Experience } from "../entities/Experience";
import { generateRecurrence } from "../useCases/experiences/recurrent/recurrenceRules";
import { FieldError } from "./Outputs/ErrorOutputs";

// default is ISO format ("isoDate") - "2018-02-07T21:04:39.573Z"
// https://typegraphql.com/docs/0.16.0/scalars.html
@InputType()
export class CreateRecurrentDatesInputs {
  @Field(() => Date)
  startDate!: Date;
  @Field(() => Date)
  endDate!: Date;
  @Field()
  durationInMinutes!: number;
  @Field({ nullable: true })
  typeOfEvent?: string;
  @Field(() => [Date], { nullable: true })
  customDates?: Date[];
  @Field(() => [Date], { nullable: true })
  exceptions?: Date[];
  //   export type WeekStart = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA';
  @Field(() => [String], { nullable: true })
  exceptionDays?: string[];
}

@ObjectType()
export class DateWithTimes {
  @Field(() => Date)
  date: Date;
  @Field(() => [Date])
  times: Date[];
}

@ObjectType()
export class RecurrenceResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [DateWithTimes], { nullable: true })
  dateWithTimes?: DateWithTimes[];
}
@Resolver(Experience)
export class ExperienceResolvers {
  //@Authorized("owner")
  @Query(() => RecurrenceResponse)
  recurrentDates(
    @Arg("createRecurrentDatesInputs")
    createRecurrentDatesInputs: CreateRecurrentDatesInputs
  ): RecurrenceResponse {
    return generateRecurrence({ ...createRecurrentDatesInputs });
  }
}
