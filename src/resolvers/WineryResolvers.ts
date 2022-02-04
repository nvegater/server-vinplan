import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { Winery } from "../entities/Winery";

import CreateWineryInputs from "./Inputs/CreateWineryInputs";
import { GetWineryInputs, UserInputs } from "./Inputs/UserInputs";

import { WineryResponse } from "./Outputs/WineryOutputs";

import {
  confirmConnectedAccountCreation,
  getWinery,
} from "../useCases/winery/createWinery";
import { createWinery } from "../useCases/winery/createWinery";

@Resolver(Winery)
export class WineryResolvers {
  @Query(() => Int)
  async allWineries() {
    return 0;
  }

  @Authorized("owner", "visitor")
  @Query(() => WineryResponse)
  async winery(
    @Arg("getWineryInputs") getWineryInputs: GetWineryInputs
  ): Promise<WineryResponse> {
    return await getWinery({ ...getWineryInputs });
  }

  @Mutation(() => WineryResponse)
  async createWinery(
    @Arg("userInputs") userInputs: UserInputs,
    @Arg("createWineryInputs") createWineryInputs: CreateWineryInputs
  ): Promise<WineryResponse> {
    return await createWinery({ user: userInputs, winery: createWineryInputs });
  }

  @Authorized("owner")
  @Mutation(() => WineryResponse, {
    description:
      "Trigger: winery information Page. " +
      "If called for the first time, updates the winery connected account creation date" +
      "Otherwise simply return the winery",
  })
  async confirmConnectedAccount(
    @Arg("wineryAlias") wineryAlias: string
  ): Promise<WineryResponse> {
    return await confirmConnectedAccountCreation(wineryAlias);
  }

  // TODO get all wineries Names with ID for the filters
  // TODO edit winery Information
}
