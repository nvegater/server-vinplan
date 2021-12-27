import { Field, Float, InputType } from "type-graphql";
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
  @Field()
  limit: number;
  @Field(() => [Valley])
  valley: Valley[];
  @Field(() => [ExperienceType], { nullable: true })
  experienceType: ExperienceType[] | null;
  @Field({ nullable: true })
  cursor: string | null;
  @Field({ nullable: true })
  experienceName: string | null;
}
