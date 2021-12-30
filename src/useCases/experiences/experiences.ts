import { Experience } from "../../entities/Experience";
import {
  PaginatedExperience,
  PaginatedExperiences,
  PaginatedExperiencesWithSlots,
  PaginatedExperienceWithSlots,
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
import { notEmpty } from "../../dataServices/utils";

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

export const getExperiencesWithEditableSlots = async (
  wineryId: number,
  paginatedExperiencesInputs: PaginatedExperiencesInputs
): Promise<PaginatedExperiencesWithSlots> => {
  const allExperiences: Experience[] = await retrieveAllExperiencesFromWinery(
    wineryId
  );

  if (allExperiences.length === 0) {
    const errorObject = customError("experience", "no Created Experiences");

    return {
      ...errorObject,
      totalExperiences: 0,
      paginationConfig: paginatedExperiencesInputs.paginationConfig,
    };
  }

  const NOW_DATE_STRING = new Date();

  const experiencesWithFutureSlots: Experience[] = await Promise.all(
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

  const noEmptySlotsExps = experiencesWithFutureSlots.filter(
    (exp) => exp.slots && exp.slots.length > 0
  );

  if (allExperiences.length === 0) {
    const errorObject = customError(
      "experienceSlots",
      "Cant get Editable slots"
    );
    return {
      ...errorObject,
      totalExperiences: 0,
      paginationConfig: paginatedExperiencesInputs.paginationConfig,
    };
  }

  const winery = await getWineryById_DS(wineryId);

  if (winery == null) {
    const errorObject = customError("winery", "Error retrieving winery");
    return {
      ...errorObject,
      totalExperiences: 0,
      paginationConfig: paginatedExperiencesInputs.paginationConfig,
    };
  }

  const paginatedExperiencesWithSlots: PaginatedExperienceWithSlots[] =
    noEmptySlotsExps.map((exp) => ({ ...exp, wineryName: winery.name }));

  return {
    experiences: paginatedExperiencesWithSlots,
    totalExperiences: noEmptySlotsExps.length,
    paginationConfig: paginatedExperiencesInputs.paginationConfig,
  };
};
