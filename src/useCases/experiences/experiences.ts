import { Experience } from "../../entities/Experience";
import {
  PaginatedExperience,
  PaginatedExperiences,
  PaginatedExperiencesWithSlots,
  PaginatedExperienceWithSlots,
} from "../../resolvers/Outputs/CreateExperienceOutputs";
import {
  countSlotsStartingFrom,
  experiencesWithCursor_DS,
  getSlotsStartingFrom,
  retrieveAllExperiencesFromWinery,
} from "../../dataServices/experience";
import { PaginatedExperiencesInputs } from "../../resolvers/Inputs/CreateExperienceInputs";
import { ExperienceSlot } from "../../entities/ExperienceSlot";
import { customError } from "../../resolvers/Outputs/ErrorOutputs";
import { getWineryById_DS } from "../../dataServices/winery";
import { notEmpty } from "../../dataServices/utils";

async function includeWineryInformation(paginatedExperiences: Experience[]) {
  const experiences = await Promise.all(
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
  return experiences.filter(notEmpty);
}

export const getPaginatedExperiences = async (
  paginatedExperiencesInputs: PaginatedExperiencesInputs
): Promise<PaginatedExperiences> => {
  const realLimit = Math.min(
    20,
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

  const experiences: PaginatedExperience[] = await includeWineryInformation(
    paginatedExperiences
  );

  if (experiences.length === 0) {
    return {
      ...customError(
        "experiencesWinery",
        "Couldnt attach winery information to the experience"
      ),
      totalExperiences: 0,
      paginationConfig: { afterCursor, beforeCursor, limit: realLimit },
    };
  }
  return {
    experiences: experiences,
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
      const slotsFromTheFuture: ExperienceSlot[] = await getSlotsStartingFrom(
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

export const getExperiencesWithBookableSlots = async (
  paginatedExperiencesInputs: PaginatedExperiencesInputs
): Promise<PaginatedExperiences> => {
  const realLimit = Math.min(
    20,
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

  if (paginatedExperiences.length === 0) {
    const errorObject = customError(
      "experiencesPagination",
      "Couldnt find any experiences"
    );

    return {
      ...errorObject,
      totalExperiences: totalResults,
      paginationConfig: { afterCursor, beforeCursor, limit: realLimit },
    };
  }
  const experiences: PaginatedExperience[] = await includeWineryInformation(
    paginatedExperiences
  );

  if (experiences.length === 0) {
    return {
      ...customError(
        "experiencesWinery",
        "Couldnt attach winery information to the experience"
      ),
      totalExperiences: totalResults,
      paginationConfig: { afterCursor, beforeCursor, limit: realLimit },
    };
  }

  const NOW_DATE_STRING = new Date();

  // TODO move this to the createQueryWithFilters method
  const experiencesWithFutureSlots: {
    exp: PaginatedExperience;
    removeExperience: boolean;
  }[] = await Promise.all(
    experiences.map(async (exp) => {
      const slotsInTheFuture = await countSlotsStartingFrom(
        exp.id,
        NOW_DATE_STRING
      );
      const removeExperience = slotsInTheFuture === 0;
      // only include Experiences with slots in the future
      // the include flag is just an ugly hack because I cant use `.filter` in promise.all
      // https://stackoverflow.com/questions/33355528/filtering-an-array-with-a-function-that-returns-a-promise
      return { exp, removeExperience };
    })
  );

  // Remove the experiences that have falsy "include" flag.
  const bookableExperiences: PaginatedExperience[] = experiencesWithFutureSlots
    .filter((exp) => !exp.removeExperience)
    .map((exp) => exp.exp);

  if (bookableExperiences.length === 0) {
    const errorObject = customError(
      "experiences",
      `No bookable experiences from ${totalResults.toString()}`
    );
    return {
      ...errorObject,
      totalExperiences: totalResults,
      paginationConfig: { afterCursor, beforeCursor, limit: realLimit },
    };
  }

  return {
    experiences: bookableExperiences,
    totalExperiences: totalResults,
    // TODO pagination config for bookable is not working. It refers to the total pagination
    paginationConfig: { afterCursor, beforeCursor, limit: realLimit },
  };
};
