import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Experience } from "../entities/Experience";

import {
  CreateRecurrentDatesInputs,
  CreateExperienceInputs,
} from "./Inputs/CreateExperienceInputs";
import {
  RecurrenceResponse,
  ExperienceResponse,
} from "./Outputs/CreateExperienceOutputs";

import { generateRecurrence } from "../useCases/experiences/recurrent/recurrenceRules";
import { createExperienceWinery } from "../useCases/experiences/createExperience";

@Resolver(Experience)
export class ExperienceResolvers {
  @Query(() => RecurrenceResponse)
  recurrentDates(
    @Arg("createRecurrentDatesInputs")
    createRecurrentDatesInputs: CreateRecurrentDatesInputs
  ): RecurrenceResponse {
    return generateRecurrence({ ...createRecurrentDatesInputs });
  }

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
}
