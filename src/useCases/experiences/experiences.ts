import { Experience } from "../../entities/Experience";
import {
  ExperiencesResponse,
  PaginatedExperiences,
} from "../../resolvers/Outputs/CreateExperienceOutputs";
import {
  experiencesWithCursor_DS,
  getSlotsFromTheFuture,
  retrieveAllExperiencesFromWinery,
} from "../../dataServices/experience";
import { PaginatedExperiencesInputs } from "../../resolvers/Inputs/CreateExperienceInputs";
import { ExperienceSlot } from "../../entities/ExperienceSlot";
import { customError } from "../../resolvers/Outputs/ErrorOutputs";

export const getPaginatedExperiences = async ({
  limit,
  cursor,
  experienceName,
  experienceType,
  valley,
}: PaginatedExperiencesInputs): Promise<PaginatedExperiences> => {
  const realLimit = Math.min(50, limit);

  const paginatedExperiences: Experience[] = await experiencesWithCursor_DS(
    limit,
    cursor,
    experienceName,
    experienceType,
    valley
  );

  return {
    experiences: paginatedExperiences.slice(0, realLimit),
    moreExperiencesAvailable: paginatedExperiences.length === realLimit + 1, // DB has more posts than requested
    totalExperiences: paginatedExperiences.length,
  };
};
export const getAllExperiencesFromWinery = async (
  wineryId: number
): Promise<Experience[]> => {
  return await retrieveAllExperiencesFromWinery(wineryId);
};

//const isInTheFuture = (slot: ExperienceSlot) => slot.startDateTime;

export const getExperiencesWithEditableSlots = async (
  wineryId: number
): Promise<ExperiencesResponse> => {
  // Editable is an experience that has slots in the future.
  //    The future slots, have more than 0 bookings: If someone already booked, notify the user about the change#
  // if experience is in the past, no editable!

  const allExperiences: Experience[] = await retrieveAllExperiencesFromWinery(
    wineryId
  );

  if (allExperiences.length === 0) {
    return customError("experience", "no Created Experiences");
  }

  // at least one element in the slots Is in the future
  // otherwise the experience will get filtered out
  /*  const experiencesWithFutureSlots: Experience[] = allExperiences.filter(
    (exp) => exp.slots.some((slot) => isInTheFuture(slot))
  );*/

  const NOW_DATE_STRING = new Date().toISOString();

  const experiences: Experience[] = await Promise.all(
    allExperiences.map(async (exp) => {
      const slotsFromTheFuture: ExperienceSlot[] = await getSlotsFromTheFuture(
        exp.id,
        NOW_DATE_STRING
      );
      return {
        ...exp,
        slots: slotsFromTheFuture,
      } as Experience;
    })
  );

  if (allExperiences.length === 0) {
    return customError("experienceSlots", "Cant get Editable slots");
  }

  return { experiences };
};
