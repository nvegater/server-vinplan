import { add } from "date-fns";
import { Experience, ExperienceType } from "../entities/Experience";
import { ExperienceSlot, SlotType } from "../entities/ExperienceSlot";
import { typeReturn } from "./utils";
import { getConnection, getRepository, SelectQueryBuilder } from "typeorm";
import { findWineriesByValley } from "./winery";
import { buildPaginator } from "typeorm-cursor-pagination";
import {
  ExperiencesFilters,
  PaginatedExperiencesInputs,
} from "../resolvers/Inputs/CreateExperienceInputs";

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

export const getUpcomingWineryExperiences = async (wineryId: number) => {
  const now = new Date();

  const qb = getRepository(Experience)
    .createQueryBuilder("exp")
    .select(["exp.id", "exp.title", "exp.experienceType"])
    .andWhere("exp.wineryId = :wineryId", { wineryId })
    .leftJoin("exp.slots", "slot")
    .andWhere('slot."startDateTime" > :starting ', {
      starting: now,
    });
  return await qb.getMany();
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
  pricePerPersonInDollars: number;
}

export const createSlots = async (
  experienceId: number,
  slotDates: Date[],
  slotDuration: number,
  slotType: SlotType,
  limitOfAttendees: number,
  pricePerPersonInDollars: number
): Promise<ExperienceSlot[]> => {
  const slots = slotDates.map((slot) => {
    const createSlotInputs: CreateSlotsInputs = {
      experienceId: experienceId,
      startDateTime: slot,
      endDateTime: add(slot, { minutes: slotDuration }),
      slotType: slotType,
      durationInMinutes: slotDuration,
      limitOfAttendees,
      pricePerPersonInDollars: pricePerPersonInDollars,
    };
    return ExperienceSlot.create({ ...createSlotInputs });
  });

  slots.map(async (slot) => await slot.save());

  return slots;
};

export const getExperienceWithSlots_DS = async (experienceId: number) => {
  return await Experience.findOne({
    where: { id: experienceId },
    relations: ["slots", "winery", "images"],
  });
};

export const getSlotsStartingFrom = async (
  experienceId: number,
  starting: Date,
  untilDateTime?: Date | null,
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

  if (untilDateTime) {
    qs.andWhere('slot."startDateTime" < :ending ', {
      ending: untilDateTime,
    });
  }

  if (withAvailablePlaces) {
    qs.andWhere('slot."noOfAttendees" < slot."limitOfAttendees"');
  }

  return await qs.getMany();
};

export const retrieveAllExperiencesFromWinery = async (wineryId: number) => {
  return await Experience.find({ where: { wineryId } });
};

const createQueryWithFilters = async ({
  hasSlotsInFuture,
  fromDateTime,
  untilDateTime,
  experienceName,
  experienceType,
  wineryIds,
  valley,
}: ExperiencesFilters): Promise<SelectQueryBuilder<Experience>> => {
  const qs = getRepository(Experience).createQueryBuilder("experience");

  if (hasSlotsInFuture) {
    const now = new Date();
    qs.leftJoinAndSelect("experience.slots", "slot").where(
      'slot."startDateTime" > :starting ',
      {
        starting: now,
      }
    );
  }
  if (fromDateTime) {
    qs.andWhere('slot."startDateTime" > :starting ', {
      starting: fromDateTime,
    });
    if (untilDateTime) {
      qs.andWhere('slot."startDateTime" < :ending ', {
        ending: untilDateTime,
      });
    }
  }

  if (experienceName) {
    qs.andWhere("experience.title like :title", {
      title: `%${experienceName}%`,
    });
  }
  if (experienceType) {
    qs.andWhere('experience."experienceType" IN (:...experienceType)', {
      experienceType: experienceType,
    });
  }
  if (wineryIds) {
    qs.andWhere('experience."wineryId" IN (:...wineryIds)', {
      wineryIds: wineryIds,
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
  boolean
];
export const experiencesWithCursor_DS = async ({
  pagination,
  filters,
}: PaginatedExperiencesInputs): Promise<ExperiencesCursorPagination> => {
  const qs = await createQueryWithFilters(filters);

  const paginator = buildPaginator({
    entity: Experience,
    paginationKeys: ["createdAt"],
    query: {
      limit: pagination.limit,
      order: "DESC",
      beforeCursor: pagination.beforeCursor
        ? pagination.beforeCursor
        : undefined,
      afterCursor: pagination.afterCursor ? pagination.afterCursor : undefined,
    },
  });

  const { data, cursor: cursorObj } = await paginator.paginate(qs);

  const experiences = data.slice(0, pagination.limit);

  const hasMore = experiences.length === pagination.limit;

  return [experiences, cursorObj.beforeCursor, cursorObj.afterCursor, hasMore];
};

export const updateSlotVisitors = async (addedVisitors: number, id: number) => {
  const updatedSlot = await typeReturn<ExperienceSlot>(
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
  const experienceId = updatedSlot.experienceId;
  // also update the total sum of slots for that experience
  await typeReturn<Experience>(
    getConnection()
      .createQueryBuilder()
      .update(Experience)
      .set({
        allAttendeesAllSlots: () => `"allAttendeesAllSlots" + ${addedVisitors}`,
      })
      .where("id = :experienceId", { experienceId })
      .returning("*")
      .execute()
  );
  return updatedSlot;
};
