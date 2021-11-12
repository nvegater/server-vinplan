import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { Winery } from "../../entities/Winery";

import CreateWineryInputs from "../Inputs/CreateWineryInputs";
import { UserInputs } from "../Inputs/UserInputs";

import { WineryResponse } from "../Outputs/WineryOutputs";

import { getWineryByUsername } from "../../useCases/winery/createWinery";
import { createWinery } from "../../useCases/winery/createWinery";

@Resolver(Winery)
export class WineryResolvers {
  @Query(() => Int)
  async allWineries() {
    return 0;
  }

  @Query(() => WineryResponse)
  async winery(
    @Arg("creatorUsername") creatorUsername: string
  ): Promise<WineryResponse> {
    return await getWineryByUsername(creatorUsername);
  }

  @Authorized("owner")
  @Mutation(() => WineryResponse)
  async createWinery(
    @Arg("userInputs") userInputs: UserInputs,
    @Arg("createWineryInputs") createWineryInputs: CreateWineryInputs
  ): Promise<WineryResponse> {
    return await createWinery({ user: userInputs, winery: createWineryInputs });
  }
}
