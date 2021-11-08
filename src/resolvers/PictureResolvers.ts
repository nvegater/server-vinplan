import { Int, Query, Resolver } from "type-graphql";
import { Picture } from "../entities/Picture";

@Resolver(Picture)
export class PictureResolvers {
  @Query(() => Int)
  async allPictures() {
    return 0;
  }
}
