import {
  CreateExperienceInputs,
  CreateRecurrentDatesInputs,
} from "../../resolvers/Inputs/CreateExperienceInputs";
import {
  ExperienceResponse,
  RecurrenceResponse,
} from "../../resolvers/Outputs/CreateExperienceOutputs";
import {
  createEmptyExperience,
  createSlots,
  getExperienceByTitle,
  getExperienceWithSlots_DS,
  getSlotsStartingFrom,
} from "../../dataServices/experience";
import {
  generateOneSlot,
  generateRecurrence,
} from "./recurrent/recurrenceRules";
import { SlotType } from "../../entities/ExperienceSlot";
import { customError } from "../../resolvers/Outputs/ErrorOutputs";
import { Experience } from "../../entities/Experience";

interface CreateExperienceProps {
  createExperienceInputs: CreateExperienceInputs;
  createRecurrentDatesInputs: CreateRecurrentDatesInputs;
}
export const createExperienceWinery = async ({
  createExperienceInputs,
  createRecurrentDatesInputs,
}: CreateExperienceProps): Promise<ExperienceResponse> => {
  const cantGenerateSlotError = [
    {
      field: "createExperience",
      message: "Cant generate slots",
    },
  ];
  let slots: RecurrenceResponse;
  switch (createRecurrentDatesInputs.slotType) {
    case SlotType.RECURRENT:
      slots = generateRecurrence({ ...createRecurrentDatesInputs });
      break;
    case SlotType.ONE_TIME:
      slots = {
        dateWithTimes: [
          generateOneSlot(
            createRecurrentDatesInputs.startDate,
            createRecurrentDatesInputs.endDate
          ),
        ],
      };
      break;
    case SlotType.ALL_DAY:
      slots = {
        dateWithTimes: [
          generateOneSlot(
            createRecurrentDatesInputs.startDate,
            createRecurrentDatesInputs.endDate,
            true
          ),
        ],
      };
      break;
    default:
      slots = { errors: cantGenerateSlotError };
  }

  if (
    slots.dateWithTimes === undefined ||
    (slots.dateWithTimes && slots.dateWithTimes?.length === 0)
  ) {
    return {
      errors: cantGenerateSlotError,
    };
  }

  const existingExperience = await getExperienceByTitle(
    createExperienceInputs.title
  );
  if (existingExperience) {
    return {
      errors: [
        {
          field: "title",
          message: "Experience with that title already exists",
        },
      ],
    };
  }

  const createdExperience = await createEmptyExperience({
    ...createExperienceInputs,
  });

  const allSlotTimes: Date[][] = slots.dateWithTimes.map(
    (dateWithTime) => dateWithTime.times
  );
  // Until flat is available
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
  const slotDates: Date[] = allSlotTimes.reduce(
    (acc, val) => acc.concat(val),
    []
  );

  const createdSlots = await createSlots(
    createdExperience.id,
    slotDates,
    createRecurrentDatesInputs.durationInMinutes,
    createRecurrentDatesInputs.slotType,
    createExperienceInputs.limitOfAttendees
  );

  if (createdSlots.length === 0) {
    return {
      errors: cantGenerateSlotError,
    };
  }

  return {
    experience: createdExperience,
    dateWithTimes: slots.dateWithTimes,
  };
};

export const getExperienceWithSlots = async (
  experienceId: number,
  onlyBookableSlots: boolean
): Promise<ExperienceResponse> => {
  const experience = await getExperienceWithSlots_DS(experienceId);
  if (experience == null) {
    return customError("experienceSlots", "Couldnt find an experience with id");
  }
  const NOW_DATE_STRING = new Date();

  if (!onlyBookableSlots) {
    return { experience: experience };
  }

  const slotsFromTheFuture = await getSlotsStartingFrom(
    experience.id,
    NOW_DATE_STRING,
    onlyBookableSlots
  );

  const expWBookableSlots: Experience = {
    ...experience,
    slots: slotsFromTheFuture,
  } as Experience;

  return { experience: expWBookableSlots };
};
