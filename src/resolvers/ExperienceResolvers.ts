import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Experience } from "../entities/Experience";

import {
  CreateExperienceInputs,
  CreateRecurrentDatesInputs,
  PaginatedExperiencesInputs,
} from "./Inputs/CreateExperienceInputs";
import {
  ExperiencesList,
  ExperienceResponse,
  PaginatedExperiences,
  PaginatedExperiencesWithSlots,
  RecurrenceResponse,
} from "./Outputs/CreateExperienceOutputs";

import { generateRecurrence } from "../useCases/experiences/recurrent/recurrenceRules";
import {
  createExperienceWinery,
  getExperienceWithSlots,
} from "../useCases/experiences/createExperience";
import {
  getExperiencesListFromFuture,
  getExperiencesWithBookableSlots,
  getExperiencesWithEditableSlots,
  getPaginatedExperiences,
} from "../useCases/experiences/experiences";

@Resolver(Experience)
export class ExperienceResolvers {
  @Query(() => ExperienceResponse)
  async experienceWithSlots(
    @Arg("experienceId") experienceId: number,
    @Arg("onlyBookableSlots") onlyBookableSlots: boolean
  ): Promise<ExperienceResponse> {
    return await getExperienceWithSlots(experienceId, onlyBookableSlots);
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
  @Query(() => PaginatedExperiencesWithSlots)
  async editableExperiences(
    @Arg("wineryId")
    wineryId: number,
    @Arg("paginatedExperiencesInputs")
    paginatedExperiencesInputs: PaginatedExperiencesInputs
  ): Promise<PaginatedExperiencesWithSlots> {
    try {
      return await getExperiencesWithEditableSlots(
        wineryId,
        paginatedExperiencesInputs
      );
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

  @Query(() => ExperiencesList)
  async experiencesList(): Promise<ExperiencesList> {
    return await getExperiencesListFromFuture();
  }
}
