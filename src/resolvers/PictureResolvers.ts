import { Int, Query, Resolver } from "type-graphql";
import { ExperienceImage } from "../entities/Images";

@Resolver(ExperienceImage)
export class ExperienceImagesResolvers {
  @Query(() => Int)
  async allPictures() {
    return 0;
  }
}
