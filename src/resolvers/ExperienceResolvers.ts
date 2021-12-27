import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Experience } from "../entities/Experience";

import {
  CreateExperienceInputs,
  CreateRecurrentDatesInputs,
  PaginatedExperiencesInputs,
} from "./Inputs/CreateExperienceInputs";
import {
  ExperienceResponse,
  ExperiencesResponse,
  PaginatedExperiences,
  RecurrenceResponse,
} from "./Outputs/CreateExperienceOutputs";

import { generateRecurrence } from "../useCases/experiences/recurrent/recurrenceRules";
import {
  createExperienceWinery,
  getExperienceWithSlots,
} from "../useCases/experiences/createExperience";
import {
  getExperiencesWithEditableSlots,
  getPaginatedExperiences,
} from "../useCases/experiences/experiences";

@Resolver(Experience)
export class ExperienceResolvers {
  @Query(() => ExperienceResponse)
  async experienceWithSlots(
    @Arg("experienceId") experienceId: number
  ): Promise<ExperienceResponse> {
    return await getExperienceWithSlots(experienceId);
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

  @Query(() => PaginatedExperiences)
  async editableExperiences(
    @Arg("wineryId")
    wineryId: number
  ): Promise<ExperiencesResponse> {
    try {
      return await getExperiencesWithEditableSlots(wineryId);
    } catch (error) {
      throw new Error(error);
    }
  }
}
