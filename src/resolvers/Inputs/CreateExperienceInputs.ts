import { Field, Float, InputType, Int } from "type-graphql";
import { ExperienceType } from "../../entities/Experience";
import { SlotType } from "../../entities/ExperienceSlot";
import { Valley } from "../../entities/Winery";

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

@InputType({
  description:
    "BefCur:null & AftCur:null => First Page N Results (N=limit) + AftCur:Y (if more results exist)." +
    "BefCur:null & AftCur:Y => Page with N Results + BefCurY + AftCur:X (if more exist)" +
    "BefCur:X & AftCur:null => End of the list." +
    "BefCur:X & AftCur:Y => Ignores X.",
})
export class CursorPaginationInput {
  @Field(() => String, { nullable: true })
  afterCursor: string | null;
  @Field(() => String, { nullable: true })
  beforeCursor: string | null;
  @Field(() => Int, { nullable: true })
  limit: number;
}

@InputType()
export class ExperiencesFilters {
  @Field(() => [Valley], { nullable: true })
  valley: Valley[];
  @Field(() => [ExperienceType], { nullable: true })
  experienceType: ExperienceType[] | null;
  @Field(() => String, { nullable: true })
  experienceName: string | null;
  @Field(() => [Int], { nullable: true })
  wineryIds: number[] | null;
}

@InputType({
  description:
    "Default: \n" +
    "Sort from Newest to Oldest all the Table.\n" +
    "It never exceeds the limit\n" +
    "\n" +
    "Optional: \n" +
    "The cursor is a timestamp.\n" +
    "Returns all the experiences after the given timestamp (with limit)\n" +
    "If no cursor is provided, it will return all experiences newest First (with limit)\n" +
    "\n" +
    "Filters:\n" +
    "If experience name is provided search without exact match (LIKE)\n" +
    "ExperienceType: if null, All the experience Types. Otherwise ONLY the selected ones.\n" +
    "Valleys: if null, All the Valleys. Otherwise ONLY the selected ones.",
})
export class PaginatedExperiencesInputs {
  @Field(() => CursorPaginationInput)
  paginationConfig: CursorPaginationInput;
  @Field(() => ExperiencesFilters)
  experiencesFilters: ExperiencesFilters;
  @Field(() => Boolean, { nullable: true })
  getUpcomingSlots?: boolean | null;
  @Field(() => Boolean, { nullable: true })
  onlyWithAvailableSeats?: boolean | null;
}
