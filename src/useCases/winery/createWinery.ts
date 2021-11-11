import { UserInputs } from "../../resolvers/Inputs/UserInputs";
import CreateWineryInputs from "../../resolvers/Inputs/CreateWineryInputs";
import { WineryResponse } from "../../resolvers/Outputs/WineryOutputs";

interface CreateWineryHookProps {
  winery: CreateWineryInputs;
  user: UserInputs;
}

type CreateWineryHookResult = Promise<WineryResponse>;

type CreateWineryHook = (
  props: CreateWineryHookProps
) => CreateWineryHookResult;

const createWinery: CreateWineryHook = async ({ winery, user }) => {
  console.log(winery);
  console.log(user);
  return await { errors: [{ message: "Not implemented", field: "winery" }] };
};

export default createWinery;
