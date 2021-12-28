import { Field, Int, ObjectType } from "type-graphql";
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

@ObjectType()
export class ExperiencesResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [Experience], { nullable: true })
  experiences?: Experience[];
}

@ObjectType({
  description:
    "BefCur:null & AftCur:null => First Page N Results (N=limit) + AftCur:Y (if more results exist)." +
    "BefCur:null & AftCur:Y => Page with N Results + BefCurY + AftCur:X (if more exist)" +
    "BefCur:X & AftCur:null => End of the list." +
    "BefCur:X & AftCur:Y => Ignores X.",
})
export class CursorPaginationResult {
  @Field(() => String, { nullable: true })
  afterCursor: string | null;
  @Field(() => String, { nullable: true })
  beforeCursor: string | null;
  @Field(() => Int, { nullable: true })
  limit: number;
}

@ObjectType()
export class PaginatedExperiences {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [Experience], { nullable: true })
  experiences?: Experience[];
  @Field(() => Number)
  totalExperiences: number;
  @Field(() => CursorPaginationResult)
  paginationConfig: CursorPaginationResult;
}
