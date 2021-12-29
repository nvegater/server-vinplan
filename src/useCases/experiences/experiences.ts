import { Experience } from "../../entities/Experience";
import {
  ExperiencesResponse,
  PaginatedExperience,
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
import { getWineryById_DS } from "../../dataServices/winery";

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  if (value === null || value === undefined) return false;
  const dummy: TValue = value;
  return Boolean(dummy);
}

export const getPaginatedExperiences = async (
  paginatedExperiencesInputs: PaginatedExperiencesInputs
): Promise<PaginatedExperiences> => {
  const realLimit = Math.min(
    50,
    paginatedExperiencesInputs.paginationConfig.limit
  );

  const [paginatedExperiences, beforeCursor, afterCursor, totalResults] =
    await experiencesWithCursor_DS({
      ...paginatedExperiencesInputs,
      paginationConfig: {
        ...paginatedExperiencesInputs.paginationConfig,
        limit: realLimit,
      },
    });

  const experiences: (PaginatedExperience | null)[] = await Promise.all(
    paginatedExperiences.map(async (dbExp) => {
      const winery = await getWineryById_DS(dbExp.wineryId);
      if (winery == null) return null;
      return {
        wineryName: winery?.name,
        id: dbExp.id,
        title: dbExp.title,
        description: dbExp.description,
        experienceType: dbExp.experienceType,
        allAttendeesAllSlots: dbExp.allAttendeesAllSlots,
        pricePerPersonInDollars: dbExp.pricePerPersonInDollars,
        wineryId: dbExp.wineryId,
        createdAt: dbExp.createdAt,
      } as PaginatedExperience;
    })
  );

  const expNoUndefined: PaginatedExperience[] = experiences.filter(notEmpty);

  return {
    experiences: expNoUndefined,
    totalExperiences: totalResults,
    paginationConfig: {
      beforeCursor: beforeCursor,
      afterCursor: afterCursor,
      limit: realLimit,
    },
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
