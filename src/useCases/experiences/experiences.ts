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
  getUpcomingWineryExperiences,
  getExperienceWithSlots_DS,
  getSlotsStartingFrom,
} from "../../dataServices/experience";
import { PaginatedExperiencesInputs } from "../../resolvers/Inputs/CreateExperienceInputs";
import { customError } from "../../resolvers/Outputs/ErrorOutputs";
import { getWineryById_DS } from "../../dataServices/winery";
import { notEmpty } from "../../dataServices/utils";
import {
  countExperienceImagesByExperienceId,
  getImagesByExperienceId,
} from "../../dataServices/pictures";
import { GetImage } from "../../resolvers/Outputs/presignedOutputs";
import { getWineryImageGetURL } from "../../dataServices/s3Utilities";

async function includeDeps(paginatedExperiences: Experience[]) {
  const experiences = await Promise.all(
    paginatedExperiences.map(async (dbExp) => {
      const winery = await getWineryById_DS(dbExp.wineryId);
      const images = await getImagesByExperienceId(dbExp.id);

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

  const [paginatedExperiences, beforeCursor, afterCursor, moreResults] =
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

  return {
    experiences: experiences,
    paginationConfig: {
      beforeCursor: beforeCursor,
      afterCursor: afterCursor,
      limit: realLimit,
      moreResults: moreResults,
    },
  };
};

export const getExperiencesWithEditableSlots = async (
  paginatedExperiencesInputs: PaginatedExperiencesInputs
): Promise<PaginatedExperiences> => {
  const realLimit = Math.min(
    20,
    paginatedExperiencesInputs.paginationConfig.limit
  );
  const [paginatedExperiences, beforeCursor, afterCursor, moreResults] =
    await experiencesWithCursor_DS({
      ...paginatedExperiencesInputs,
      paginationConfig: {
        ...paginatedExperiencesInputs.paginationConfig,
        limit: realLimit,
      },
      getUpcomingSlots: true,
    });

  const experiences: PaginatedExperience[] = await includeDeps(
    paginatedExperiences
  );

  return {
    experiences: experiences,
    paginationConfig: {
      beforeCursor: beforeCursor,
      afterCursor: afterCursor,
      limit: realLimit,
      moreResults: moreResults,
    },
  };
};

export const getExperiencesWithBookableSlots = async (
  paginatedExperiencesInputs: PaginatedExperiencesInputs
): Promise<PaginatedExperiences> => {
  const realLimit = Math.min(
    20,
    paginatedExperiencesInputs.paginationConfig.limit
  );

  const [paginatedExperiences, beforeCursor, afterCursor, moreResults] =
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
      paginationConfig: {
        afterCursor,
        beforeCursor,
        limit: realLimit,
        moreResults: false,
      },
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
      paginationConfig: {
        afterCursor,
        beforeCursor,
        limit: realLimit,
        moreResults: false,
      },
    };
  }

  return {
    experiences: experiences,
    paginationConfig: {
      afterCursor,
      beforeCursor,
      limit: realLimit,
      moreResults: moreResults,
    },
  };
};

export const getExperiencesListFromFuture = async (
  wineryId: number
): Promise<ExperiencesList> => {
  const allExperiences = await getUpcomingWineryExperiences(wineryId);

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
    return customError("noExperiences", "You have no experiences");
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
