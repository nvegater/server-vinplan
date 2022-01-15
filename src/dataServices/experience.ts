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

export const getSlotById = async (id: number) => {
  return await ExperienceSlot.findOne(id, { relations: ["experience"] });
};

export const getSlotsByIds = async (ids: number[]) => {
  return await ExperienceSlot.findByIds(ids, { relations: ["experience"] });
};

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
    relations: ["slots", "winery"],
  });
};

export const getSlotsStartingFrom = async (
  experienceId: number,
  starting: Date,
  withAvailablePlaces: boolean = false
): Promise<ExperienceSlot[]> => {
  const qs = getRepository(ExperienceSlot)
    .createQueryBuilder("slot")
    .andWhere('slot."experienceId" = :experienceId ', {
      experienceId: experienceId,
    })
    .andWhere('slot."startDateTime" > :starting ', {
      starting: starting,
    });

  if (withAvailablePlaces) {
    qs.andWhere('slot."noOfAttendees" < slot."limitOfAttendees"');
  }

  return await qs.getMany();
};

export const retrieveAllExperiencesFromWinery = async (wineryId: number) => {
  return await Experience.find({ where: { wineryId } });
};

const createQueryWithFilters = async (
  experienceName: string | null,
  eventType: ExperienceType[] | null,
  valley: Valley[] | null,
  getUpcomingSlots: boolean | null,
  onlyWithAvailableSeats: boolean | null
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

  if (getUpcomingSlots) {
    const now = new Date();
    qs.leftJoinAndSelect("experience.slots", "slot").where(
      'slot."startDateTime" > :starting ',
      {
        starting: now,
      }
    );
  }

  if (onlyWithAvailableSeats) {
    qs.leftJoinAndSelect("experience.slots", "slot").where(
      'slot."noOfAttendees" < slot."limitOfAttendees"'
    );
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
  experiencesFilters,
  getUpcomingSlots,
  onlyWithAvailableSeats,
}: PaginatedExperiencesInputs): Promise<ExperiencesCursorPagination> => {
  const qs = await createQueryWithFilters(
    experiencesFilters.experienceName,
    experiencesFilters.experienceType,
    experiencesFilters.valley,
    getUpcomingSlots ?? false,
    onlyWithAvailableSeats ?? false
  );

  const totalResults = await qs.getCount();

  const paginator = buildPaginator({
    entity: Experience,
    paginationKeys: ["createdAt"],
    query: {
      limit: paginationConfig.limit,
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

  // Initialize empty slots because we dont care about the slots right now.
  let exps: Experience[] = data;
  exps.forEach((exp) => {
    exp.slots = [];
  });

  return [exps, cursorObj.beforeCursor, cursorObj.afterCursor, totalResults];
};

export const updateSlotVisitors = async (addedVisitors: number, id: number) => {
  return await typeReturn<ExperienceSlot>(
    getConnection()
      .createQueryBuilder()
      .update(ExperienceSlot)
      .set({
        noOfAttendees: () => `"noOfAttendees" + ${addedVisitors}`,
      })
      .where("id = :id", { id })
      .returning("*")
      .execute()
  );
};
