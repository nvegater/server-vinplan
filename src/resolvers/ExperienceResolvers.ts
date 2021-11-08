import { Int, Query, Resolver } from "type-graphql";
import { Experience } from "../entities/Experience";

@Resolver(Experience)
export class ExperienceResolvers {
  @Query(() => Int)
  async allExperiences() {
    return 0;
  }
}
