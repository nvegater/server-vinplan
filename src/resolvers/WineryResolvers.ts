import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Winery } from "../entities/Winery";

import {
  CreateWineryInputs,
  EditWineryInputs,
} from "./Inputs/CreateWineryInputs";
import { GetWineryInputs, UserInputs } from "./Inputs/UserInputs";

import { WineryResponse } from "./Outputs/WineryOutputs";

import {
  confirmConnectedAccountCreation,
  editWinery,
  getWinery,
  getWineriesNames,
  createWinery,
} from "../useCases/winery";

@Resolver(Winery)
export class WineryResolvers {
  @Query(() => [String])
  async allWineryNames(): Promise<string[]> {
    return await getWineriesNames();
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
  @Mutation(() => WineryResponse)
  async editWinery(
    @Arg("editWineryInputs") editWineryInputs: EditWineryInputs
  ): Promise<WineryResponse> {
    return await editWinery(editWineryInputs);
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
}