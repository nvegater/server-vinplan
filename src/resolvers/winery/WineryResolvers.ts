import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { Winery } from "../../entities/Winery";
import CreateWineryInputs from "../Inputs/CreateWineryInputs";
import { WineryResponse } from "../Outputs/WineryOutputs";
import { UserInputs } from "../Inputs/UserInputs";
import createWinery from "../../useCases/winery/createWinery";

@Resolver(Winery)
export class WineryResolvers {
  @Query(() => Int)
  async allWineries() {
    return 0;
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
