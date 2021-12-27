import { add } from "date-fns";
import { Experience, ExperienceType } from "../entities/Experience";
import { ExperienceSlot, SlotType } from "../entities/ExperienceSlot";
import { typeReturn } from "./utils";
import { getConnection, getRepository } from "typeorm";
import { Valley } from "../entities/Winery";
import { findWineriesByValley } from "./winery";

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

export const experiencesWithCursor_DS = async (
  realLimit: number | null,
  cursor: string | null,
  experienceName: string | null,
  eventType: ExperienceType[] | null,
  valley: Valley[] | null
): Promise<Experience[]> => {
  // se deja el state listo para el proximo query

  const qs = getRepository(Experience)
    .createQueryBuilder("experience")
    .orderBy("experience.createdAt", "DESC"); // most recent on he top

  if (cursor) {
    qs.andWhere('experience."createdAt" < :createdAt ', { createdAt: cursor });
  }

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
  if (realLimit) {
    qs.take(realLimit + 1);
  }

  return await qs.getMany();
};
