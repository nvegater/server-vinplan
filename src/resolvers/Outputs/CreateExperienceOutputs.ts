import { Field, Float, Int, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorOutputs";
import { ExperienceType } from "../../entities/Experience";
import { ExperienceSlot } from "../../entities/ExperienceSlot";
import { GetImage } from "./presignedOutputs";
import { Valley } from "../../entities/Winery";

@ObjectType()
export class ExperienceListItem {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  title: string;
  @Field(() => ExperienceType)
  experienceType!: ExperienceType;
  @Field(() => Int)
  imageCount: number;
}

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
export class ExperiencesList {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [ExperienceListItem], { nullable: true })
  experiencesList?: ExperienceListItem[];
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
  @Field(() => Boolean)
  moreResults: boolean;
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
  @Field(() => Valley, { nullable: true })
  valley?: Valley;
  @Field(() => [ExperienceSlot])
  slots: ExperienceSlot[];
  @Field(() => [GetImage], { nullable: true })
  images?: GetImage[];
}

@ObjectType()
export class ExperienceResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => PaginatedExperience, { nullable: true })
  experience?: PaginatedExperience;
  @Field(() => [DateWithTimes], { nullable: true })
  dateWithTimes?: DateWithTimes[];
}

@ObjectType()
export class EditExperienceResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Boolean, { nullable: true })
  successfulEdit?: boolean;
}

@ObjectType()
export class PaginatedExperiences {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [PaginatedExperience], { nullable: true })
  experiences?: PaginatedExperience[];
  @Field(() => Number, { nullable: true })
  totalExperiences?: number;
  @Field(() => CursorPaginationResult)
  paginationConfig: CursorPaginationResult;
}
