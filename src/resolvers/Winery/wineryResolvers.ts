import {Arg, Int, Query, Resolver} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";
import {WineriesResponse, WineryServicesResponse} from "./wineryResolversOutputs";
import {Winery} from "../../entities/Winery";
import {getConnection} from "typeorm";
import {SQL_QUERY_SELECT_WINERIES} from "../Universal/queries";
import {Service} from "../../entities/Service";

@Resolver(Winery)
export class WineryResolver {
    @Query(() => WineriesResponse)
    async allWineries(
        @Arg('limit', () => Int, {
            description: "For pagination." +
                "Max number of posts. Default is 50"
        }) limit: number
    ): Promise<WineriesResponse> {
        const realLimit = Math.min(50, limit);
        const replacements = [realLimit + 1]
        const paginatedWineriesDB = await getConnection()
            .query(SQL_QUERY_SELECT_WINERIES, replacements)

        if (paginatedWineriesDB !== undefined) {
            return {
                paginatedWineries: paginatedWineriesDB.slice(0, realLimit),
                moreWineriesAvailable: paginatedWineriesDB.length === (realLimit + 1) // DB has more posts than requested
            };
        } else {
            const fieldError: FieldError = {
                field: "allWineries",
                message: "All wineries find one is undefined"
            }
            return {
                errors: [fieldError], moreWineriesAvailable: false
            }
        }
    }

    @Query(() => WineryServicesResponse)
    async wineryServices(
        @Arg('wineryId', () => Int) wineryId: number
    ): Promise<WineryServicesResponse> {

        const wineryWithServices = await Service.find({where: {wineryId:wineryId}})
        const winery = await Winery.findOne(wineryId);

        if (wineryWithServices && winery) {
            return {
                winery: winery,
                services: wineryWithServices
            }
        } else {
            const fieldError: FieldError = {
                field: "Winery with services",
                message: "Not services found for this winery"
            }
            return {
                errors: [fieldError]
            }
        }

    }
}