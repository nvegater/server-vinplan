import { UserInputs } from "../../resolvers/Inputs/UserInputs";
import CreateWineryInputs from "../../resolvers/Inputs/CreateWineryInputs";
import { WineryResponse } from "../../resolvers/Outputs/WineryOutputs";
import { Winery } from "../../entities/Winery";
import {
  createWinery_DS,
  getWineryByUsername_DS,
} from "../../dataServices/winery";

interface CreateWineryHookProps {
  winery: CreateWineryInputs;
  user: UserInputs;
}

type CreateWineryHookResult = Promise<WineryResponse>;

type CreateWineryHook = (
  props: CreateWineryHookProps
) => CreateWineryHookResult;

export const createWinery: CreateWineryHook = async ({ winery, user }) => {
  const createdWinery = await createWinery_DS({ winery, user });
  return { winery: createdWinery };
};

export const getWineryByUsername = async (creatorUsername: string) => {
  const winery: Winery | undefined = await getWineryByUsername_DS(
    creatorUsername
  );
  if (winery === undefined) {
    return { errors: [{ message: "Not found", field: "winery" }] };
  }
  return { winery: winery };
};
