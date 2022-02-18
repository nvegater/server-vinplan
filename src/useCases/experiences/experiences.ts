import { Experience } from "../../entities/Experience";
import {
  EditExperienceResponse,
  ExperienceListItem,
  ExperiencesList,
  PaginatedExperience,
  PaginatedExperiences,
} from "../../resolvers/Outputs/CreateExperienceOutputs";
import {
  editExperienceDb,
  experiencesWithCursor_DS,
  getUpcomingWineryExperiences,
} from "../../dataServices/experience";
import {
  EditExperienceInputs,
  PaginatedExperiencesInputs,
} from "../../resolvers/Inputs/CreateExperienceInputs";
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
        valley: winery.valley,
      } as PaginatedExperience;
    })
  );
  return experiences.filter(notEmpty);
}

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

export const paginateExperiences = async ({
  pagination,
  filters,
}: PaginatedExperiencesInputs): Promise<PaginatedExperiences> => {
  // In case the param Exceeds 20 exps
  const realLimit = Math.min(20, pagination.limit);

  const [paginatedExperiences, newBeforeCursor, newAfterCursor, moreResults] =
    await experiencesWithCursor_DS({
      filters: filters,
      pagination: {
        ...pagination,
        limit: realLimit,
      },
    });

  const experiences: PaginatedExperience[] = await includeDeps(
    paginatedExperiences
  );

  if (experiences.length === 0) {
    return {
      ...customError("experiencesPagination", "Couldnt find any experiences"),
      paginationConfig: { ...pagination, moreResults: false },
    };
  }

  const expsWithSortedSlots: PaginatedExperience[] = experiences.map((e) => {
    const sortedSlots = e.slots.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return a.startDateTime.getTime() - b.startDateTime.getTime();
    });
    return { ...e, slots: sortedSlots };
  });

  return {
    experiences: expsWithSortedSlots,
    paginationConfig: {
      beforeCursor: newBeforeCursor,
      afterCursor: newAfterCursor,
      limit: realLimit,
      moreResults: moreResults,
    },
  };
};

export const editExperience = async (
  inputs: EditExperienceInputs
): Promise<EditExperienceResponse> => {
  const isUpdatedExperience = await editExperienceDb(inputs);

  if (!isUpdatedExperience)
    return customError("editExperience", "Error updating experience");

  return { successfulEdit: isUpdatedExperience };
};
