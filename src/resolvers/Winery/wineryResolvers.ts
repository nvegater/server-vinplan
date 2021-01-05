import {Query, Resolver} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";
import {WineryResponse} from "./wineryResolversOutputs";
import {Winery} from "../../entities/Winery";

@Resolver(Winery)
export class WineryResolver {
    @Query(() => WineryResponse)
    async allWineries(): Promise<WineryResponse> {
        const wineryDB = await Winery.findOne();
        if (wineryDB !== undefined) {
            return {winery: [wineryDB]};
        } else {
            const fieldError: FieldError = {
                field: "allWineries",
                message: "All wineries find one is undefined"
            }
            return {
                errors: [fieldError]
            }
        }
    }
}