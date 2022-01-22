import { Experience } from "../../entities/Experience";
import {
  ExperienceListItem,
  ExperienceResponse,
  ExperiencesList,
  PaginatedExperience,
  PaginatedExperiences,
} from "../../resolvers/Outputs/CreateExperienceOutputs";
import {
  experiencesWithCursor_DS,
  getAllExperiencesFromFuture,
  getExperienceWithSlots_DS,
  getSlotsStartingFrom,
  retrieveAllExperiencesFromWinery,
} from "../../dataServices/experience";
import { PaginatedExperiencesInputs } from "../../resolvers/Inputs/CreateExperienceInputs";
import { ExperienceSlot } from "../../entities/ExperienceSlot";
import { customError } from "../../resolvers/Outputs/ErrorOutputs";
import { getWineryById_DS } from "../../dataServices/winery";
import { notEmpty } from "../../dataServices/utils";
import {
  countExperienceImagesByExperienceId,
  getExperienceImages,
} from "../../dataServices/pictures";
import { GetImage } from "../../resolvers/Outputs/presignedOutputs";
import { getWineryImageGetURL } from "../../dataServices/s3Utilities";

async function includeDeps(paginatedExperiences: Experience[]) {
  const experiences = await Promise.all(
    paginatedExperiences.map(async (dbExp) => {
      const winery = await getWineryById_DS(dbExp.wineryId);
      const images = await getExperienceImages(dbExp.id);

      const gettableImages: GetImage[] = images.map((image) => {
        const imageName = image.imageName;
        const getUrl = getWineryImageGetURL(imageName, winery!.urlAlias);
        return {
          id: image.id,
          imageName,
          getUrl,
        };
      });

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
        slots: dbExp.slots,
        images: gettableImages,
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

  const experiences: PaginatedExperience[] = await includeDeps(
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
): Promise<PaginatedExperiences> => {
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

  const experiences: PaginatedExperience[] = await includeDeps(
    experiencesWithFutureSlots
  );

  return {
    experiences: experiences,
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
      getUpcomingSlots: true,
    });

  if (paginatedExperiences.length === 0) {
    const errorObject = customError(
      "experiencesPagination",
      "Couldnt find any bookable experiences"
    );

    return {
      ...errorObject,
      totalExperiences: totalResults,
      paginationConfig: { afterCursor, beforeCursor, limit: realLimit },
    };
  }
  const experiences: PaginatedExperience[] = await includeDeps(
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

  return {
    experiences: experiences,
    totalExperiences: totalResults,
    paginationConfig: { afterCursor, beforeCursor, limit: realLimit },
  };
};

export const getExperiencesListFromFuture =
  async (): Promise<ExperiencesList> => {
    const allExperiences = await getAllExperiencesFromFuture();

    const experienceListItems: ExperienceListItem[] = await Promise.all(
      allExperiences.map(async (exp) => {
        const count = await countExperienceImagesByExperienceId(exp.id);
        return {
          id: exp.id,
          title: exp.title,
          experienceType: exp.experienceType,
          imageCount: count,
        };
      })
    );

    if (experienceListItems.length === 0) {
      return customError("", "");
    }

    return {
      experiencesList: experienceListItems,
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

  const getImages: GetImage[] =
    experience.images != null
      ? experience.images.map((i) => ({
          id: i.id,
          imageName: i.imageName,
          getUrl: getWineryImageGetURL(i.imageName, experience.winery.urlAlias),
        }))
      : [];

  if (!onlyBookableSlots) {
    return {
      experience: {
        ...experience,
        wineryName: experience.winery.name,
        images: getImages,
      },
    };
  }

  const slotsFromTheFuture = await getSlotsStartingFrom(
    experience.id,
    NOW_DATE_STRING,
    onlyBookableSlots
  );

  if (slotsFromTheFuture.length === 0) {
    return customError(
      "slots",
      "There are no slots available for that Experience"
    );
  }

  const expWBookableSlots: PaginatedExperience = {
    ...experience,
    wineryName: experience.winery.name,
    valley: experience.winery.valley,
    images: getImages,
    slots: slotsFromTheFuture,
  };

  return { experience: expWBookableSlots };
};
