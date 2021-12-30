import { Field, Float, Int, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorOutputs";
import { Experience, ExperienceType } from "../../entities/Experience";
import { ExperienceSlot } from "../../entities/ExperienceSlot";

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
export class PaginatedExperience {
  @Field(() => Int)
  id!: number;
  @Field(() => String)
  title!: string;
  @Field(() => String)
  description!: string;
  @Field(() => ExperienceType)
  experienceType!: ExperienceType;
  @Field(() => Int, { defaultValue: 0 })
  allAttendeesAllSlots: number;
  @Field(() => Float)
  pricePerPersonInDollars!: number;
  @Field(() => Int)
  wineryId!: number;
  @Field(() => String)
  wineryName!: string;
  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class PaginatedExperienceWithSlots extends PaginatedExperience {
  @Field(() => [ExperienceSlot])
  slots!: ExperienceSlot[];
}

@ObjectType()
export class PaginatedExperiences {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [PaginatedExperience], { nullable: true })
  experiences?: PaginatedExperience[];
  @Field(() => Number)
  totalExperiences: number;
  @Field(() => CursorPaginationResult)
  paginationConfig: CursorPaginationResult;
}

@ObjectType()
export class PaginatedExperiencesWithSlots extends PaginatedExperiences {
  @Field(() => [PaginatedExperienceWithSlots], { nullable: true })
  experiences?: PaginatedExperienceWithSlots[];
}
