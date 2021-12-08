import { Arg, Field, InputType, Query, Resolver } from "type-graphql";
import { Experience } from "../entities/Experience";
import { generateRecurrence } from "../useCases/experiences/recurrent/recurrenceRules";

// default is ISO format ("isoDate") - "2018-02-07T21:04:39.573Z"
// https://typegraphql.com/docs/0.16.0/scalars.html
@InputType()
export class CreateRecurrentDatesInputs {
  @Field(() => Date)
  startDate: Date;
  @Field(() => Date)
  endDate: Date;
  @Field()
  durationInMinutes: number;
  @Field()
  typeOfEvent: string;
  @Field(() => [Date])
  customDates: Date[];
  @Field(() => [Date])
  exceptions: Date[];
  @Field(() => [String])
  exceptionDays: string[];
}
@Resolver(Experience)
export class ExperienceResolvers {
  //@Authorized("owner")
  @Query(() => [String])
  recurrentDates(
    @Arg("createRecurrentDatesInputs")
    createRecurrentDatesInputs: CreateRecurrentDatesInputs
  ): string[] {
    return generateRecurrence({ ...createRecurrentDatesInputs });
  }
}
