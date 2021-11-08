import { Int, Query, Resolver } from "type-graphql";
import { Winery } from "../entities/Winery";

@Resolver(Winery)
export class WineryResolvers {
  @Query(() => Int)
  async allWineries() {
    return 0;
  }
}
