import { add } from "date-fns";
import { Experience, ExperienceType } from "../entities/Experience";
import { ExperienceSlot, SlotType } from "../entities/ExperienceSlot";
import { typeReturn } from "./utils";
import { getConnection, getRepository, SelectQueryBuilder } from "typeorm";
import { Valley } from "../entities/Winery";
import { findWineriesByValley } from "./winery";
import { buildPaginator } from "typeorm-cursor-pagination";
import { PaginatedExperiencesInputs } from "../resolvers/Inputs/CreateExperienceInputs";

interface CreateExperienceInputs {
  wineryId: number;
  title: string;
  description: string;
  limitOfAttendees: number;
  typeOfEvent: ExperienceType;
  pricePerPersonInDollars: number;
}

export const getExperienceByTitle = async (title: string) => {
  return await Experience.findOne({
    where: { title: title },
  });
};

export const createEmptyExperience = async (
  createExperienceInputs: CreateExperienceInputs
): Promise<Experience> => {
  const experience = await Experience.create({
    ...createExperienceInputs,
    experienceType: createExperienceInputs.typeOfEvent,
    slots: [],
  });
  await experience.save();
  return experience;
};

export const updateExperienceSlots = async (
  experienceSlots: ExperienceSlot[],
  experienceId: number
) => {
  return await typeReturn<Experience>(
    getConnection()
      .createQueryBuilder()
      .update(Experience)
      .set({ slots: experienceSlots })
      .where("id = :experienceId", { experienceId })
      .returning("*")
      .execute()
  );
};

interface CreateSlotsInputs {
  experienceId: number;
  startDateTime: Date;
  endDateTime: Date;
  slotType: SlotType;
  durationInMinutes: number;
  limitOfAttendees: number;
}

export const createSlots = async (
  experienceId: number,
  slotDates: Date[],
  slotDuration: number,
  slotType: SlotType,
  limitOfAttendees: number
): Promise<ExperienceSlot[]> => {
  const slots = slotDates.map((slot) => {
    const createSlotInputs: CreateSlotsInputs = {
      experienceId: experienceId,
      startDateTime: slot,
      endDateTime: add(slot, { minutes: slotDuration }),
      slotType: slotType,
      durationInMinutes: slotDuration,
      limitOfAttendees,
    };
    return ExperienceSlot.create({ ...createSlotInputs });
  });

  slots.map(async (slot) => await slot.save());

  return slots;
};

export const getExperienceWithSlots_DS = async (experienceId: number) => {
  return await Experience.findOne({
    where: { id: experienceId },
    relations: ["slots"],
  });
};

export const getSlotsFromTheFuture = async (
  experienceId: number,
  starting: string
): Promise<ExperienceSlot[]> => {
  const qs = getRepository(ExperienceSlot)
    .createQueryBuilder("experienceSlot")
    .orderBy("experienceSlot.startDateTime", "ASC")
    .andWhere('experienceSlot."startDateTime" < :starting ', {
      starting: starting,
    })
    .andWhere('experienceSlot."experienceId" = :experienceId ', {
      experienceId: experienceId,
    });

  return await qs.getMany();
};

export const retrieveAllExperiencesFromWinery = async (wineryId: number) => {
  return await Experience.find({ where: { wineryId }, relations: ["slots"] });
};

const createQueryWithFilters = async (
  experienceName: string | null,
  eventType: ExperienceType[] | null,
  valley: Valley[] | null
): Promise<SelectQueryBuilder<Experience>> => {
  const qs = getRepository(Experience).createQueryBuilder("experience");

  if (experienceName) {
    qs.andWhere("experience.title like :title", {
      title: `%${experienceName}%`,
    });
  }
  if (eventType) {
    qs.andWhere('experience."eventType" IN (:...eventType)', {
      eventType: eventType,
    });
  }
  if (valley) {
    const wineries = await findWineriesByValley(valley);
    const wineriesIds = wineries.map((winery) => winery.id);
    if (wineriesIds.length > 0) {
      qs.andWhere('experience."wineryId" IN (:...wineriesIds)', {
        wineriesIds: wineriesIds,
      });
    } else {
      // se fuerza el error porque no hay
      qs.andWhere('experience."wineryId" = -1', { wineriesIds: wineriesIds });
    }
  }

  return qs;
};
type ExperiencesCursorPagination = [
  Experience[],
  string | null,
  string | null,
  number
];
export const experiencesWithCursor_DS = async ({
  paginationConfig,
  experienceName,
  experienceType,
  valley,
}: PaginatedExperiencesInputs): Promise<ExperiencesCursorPagination> => {
  const qs = await createQueryWithFilters(
    experienceName,
    experienceType,
    valley
  );

  const totalResults = await qs.getCount();

  const paginator = buildPaginator({
    entity: Experience,
    paginationKeys: ["createdAt"],
    query: {
      limit: paginationConfig.limit + 1,
      order: "DESC",
      beforeCursor: paginationConfig.beforeCursor
        ? paginationConfig.beforeCursor
        : undefined,
      afterCursor: paginationConfig.afterCursor
        ? paginationConfig.afterCursor
        : undefined,
    },
  });

  const { data, cursor: cursorObj } = await paginator.paginate(qs);

  return [data, cursorObj.beforeCursor, cursorObj.afterCursor, totalResults];
};
