import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { Experience } from "../entities/Experience";

import {
  CreateExperienceInputs,
  CreateRecurrentDatesInputs,
  ExperienceWithSlotsInputs,
  PaginatedExperiencesInputs,
} from "./Inputs/CreateExperienceInputs";
import {
  ExperiencesList,
  ExperienceResponse,
  PaginatedExperiences,
  RecurrenceResponse,
} from "./Outputs/CreateExperienceOutputs";

import { generateRecurrence } from "../useCases/experiences/recurrent/recurrenceRules";
import { createExperienceWinery } from "../useCases/experiences/createExperience";
import {
  getExperiencesListFromFuture,
  getExperiencesWithBookableSlots,
  getExperiencesWithEditableSlots,
  getExperienceWithSlots,
  getPaginatedExperiences,
} from "../useCases/experiences/experiences";

@Resolver(Experience)
export class ExperienceResolvers {
  @Query(() => ExperienceResponse)
  async experienceWithSlots(
    @Arg("experienceWithSlotsInputs")
    experienceWithSlotsInputs: ExperienceWithSlotsInputs
  ): Promise<ExperienceResponse> {
    return await getExperienceWithSlots(experienceWithSlotsInputs);
  }
  @Authorized("owner")
  @Query(() => RecurrenceResponse)
  recurrentDates(
    @Arg("createRecurrentDatesInputs")
    createRecurrentDatesInputs: CreateRecurrentDatesInputs
  ): RecurrenceResponse {
    return generateRecurrence({ ...createRecurrentDatesInputs });
  }

  @Authorized("owner")
  @Mutation(() => ExperienceResponse)
  async createExperience(
    @Arg("createExperienceInputs")
    createExperienceInputs: CreateExperienceInputs,
    @Arg("createRecurrentDatesInputs")
    createRecurrentDatesInputs: CreateRecurrentDatesInputs
  ): Promise<ExperienceResponse> {
    return createExperienceWinery({
      createExperienceInputs,
      createRecurrentDatesInputs,
    });
  }

  @Query(() => PaginatedExperiences)
  async experiences(
    @Arg("paginatedExperiencesInputs")
    paginatedExperiencesInputs: PaginatedExperiencesInputs
  ): Promise<PaginatedExperiences> {
    try {
      return await getPaginatedExperiences(paginatedExperiencesInputs);
    } catch (error) {
      throw new Error(error);
    }
  }

  // Requires Auth because is only for wineries and its an expensive operation
  @Authorized("owner")
  @Query(() => PaginatedExperiences)
  async editableExperiences(
    @Arg("paginatedExperiencesInputs")
    paginatedExperiencesInputs: PaginatedExperiencesInputs
  ): Promise<PaginatedExperiences> {
    try {
      return await getExperiencesWithEditableSlots(paginatedExperiencesInputs);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => PaginatedExperiences)
  async bookableExperiences(
    @Arg("paginatedExperiencesInputs")
    paginatedExperiencesInputs: PaginatedExperiencesInputs
  ): Promise<PaginatedExperiences> {
    try {
      return await getExperiencesWithBookableSlots(paginatedExperiencesInputs);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Authorized("owner")
  @Query(() => ExperiencesList)
  async experiencesList(
    @Arg("wineryId", () => Int) wineryId: number
  ): Promise<ExperiencesList> {
    return await getExperiencesListFromFuture(wineryId);
  }
}
