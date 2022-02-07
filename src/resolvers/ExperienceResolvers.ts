import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { Experience } from "../entities/Experience";

import {
  CreateExperienceInputs,
  CreateRecurrentDatesInputs,
  EditExperienceInputs,
  PaginatedExperiencesInputs,
} from "./Inputs/CreateExperienceInputs";
import {
  EditExperienceResponse,
  ExperienceResponse,
  ExperiencesList,
  PaginatedExperiences,
  RecurrenceResponse,
} from "./Outputs/CreateExperienceOutputs";

import { generateRecurrence } from "../useCases/experiences/recurrent/recurrenceRules";
import { createExperienceWinery } from "../useCases/experiences/createExperience";
import {
  getExperiencesListFromFuture,
  paginateExperiences,
  editExperience,
} from "../useCases/experiences/experiences";

@Resolver(Experience)
export class ExperienceResolvers {
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

  @Authorized("owner")
  @Mutation(() => EditExperienceResponse)
  async editExperience(
    @Arg("editExperienceInputs") editExperienceInputs: EditExperienceInputs
  ): Promise<EditExperienceResponse> {
    return await editExperience(editExperienceInputs);
  }

  @Query(() => PaginatedExperiences)
  async experiences(
    @Arg("paginatedExperiencesInputs")
    paginatedExperiencesInputs: PaginatedExperiencesInputs
  ): Promise<PaginatedExperiences> {
    return await paginateExperiences(paginatedExperiencesInputs);
  }

  @Authorized("owner")
  @Query(() => ExperiencesList)
  async experiencesList(
    @Arg("wineryId", () => Int) wineryId: number
  ): Promise<ExperiencesList> {
    return await getExperiencesListFromFuture(wineryId);
  }
}
