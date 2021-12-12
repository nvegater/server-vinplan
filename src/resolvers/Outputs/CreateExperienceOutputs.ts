import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorOutputs";
import { Experience } from "../../entities/Experience";

@ObjectType()
export class DateWithTimes {
  @Field(() => Date)
  date: Date;
  @Field(() => [Date])
  times: Date[];
  @Field()
  durationInMinutes!: number;
}

@ObjectType()
export class RecurrenceResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [DateWithTimes], { nullable: true })
  dateWithTimes?: DateWithTimes[];
}

@ObjectType()
export class ExperienceResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Experience, { nullable: true })
  experience?: Experience;
  @Field(() => [DateWithTimes], { nullable: true })
  dateWithTimes?: DateWithTimes[];
}
