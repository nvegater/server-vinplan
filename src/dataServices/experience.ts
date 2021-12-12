import { add } from "date-fns";
import { Experience, ExperienceType } from "../entities/Experience";
import { ExperienceSlot, SlotType } from "../entities/ExperienceSlot";

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

export const createExperience = async (
  createExperienceInputs: CreateExperienceInputs
): Promise<Experience> => {
  const experience = await Experience.create({ ...createExperienceInputs });
  await experience.save();
  return experience;
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
