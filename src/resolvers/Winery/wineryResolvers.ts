import {Arg, Int, Query, Resolver} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";
import {WineriesResponse, WineryServicesResponse, WineryGetPreSignedUrl} from "./wineryResolversOutputs";
import {Winery} from "../../entities/Winery";
import {getConnection, In} from "typeorm";
import {SQL_QUERY_SELECT_WINERIES} from "../Universal/queries";
import {Service} from "../../entities/Service";
import {WineType} from "../../entities/WineType";
import {WineProductionType} from "../../entities/WineProductionType";
import {WineryLanguage} from "../../entities/WineryLanguage";
import {WineryAmenity} from "../../entities/WineryAmenity";
import {getPresignedUrl} from "../../utils/s3Utilities"
import {WINERYALBUM} from '../../utils/constants.json'

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
        const paginatedWineriesDB: any = await getConnection()
            .query(SQL_QUERY_SELECT_WINERIES, replacements)
        if (paginatedWineriesDB !== undefined) {
            const wineriesIds: number[] = paginatedWineriesDB.map((winery: any) => winery.id);
            const wineTypesOfWinery: WineType[] | undefined = await WineType.find({
                where: {wineryId: In(wineriesIds)}
            });
            const prodTypesOfWinery: WineProductionType[] | undefined = await WineProductionType.find({
                where: {wineryId: In(wineriesIds)}
            });
            const pagWinsWExtraProps: Winery[] = paginatedWineriesDB.map((winery: Winery) => {
                return {
                    ...winery,
                    productionType: prodTypesOfWinery.filter((wineType) => wineType.wineryId === winery.id).map((prod) => prod.productionType),
                    wineType: wineTypesOfWinery.filter((wineType) => wineType.wineryId === winery.id).map((wt) => wt.wineType),
                }
            });
            return {
                paginatedWineries: pagWinsWExtraProps.slice(0, realLimit),
                moreWineriesAvailable: pagWinsWExtraProps.length === (realLimit + 1) // DB has more posts than requested
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

        const wineryWithServices = await Service.find({where: {wineryId: wineryId}})
        const winery:any = await Winery.findOne(wineryId);

        if (wineryWithServices && winery) {
            const wineTypesOfWinery: WineType[] | undefined = await WineType.find({
                where: {wineryId: winery.id}
            });
            const prodTypesOfWinery: WineProductionType[] | undefined = await WineProductionType.find({
                where: {wineryId: winery.id}
            });

            const languages: WineryLanguage[] | undefined = await WineryLanguage.find({
                where: {wineryId: winery.id}
            });

            const amenities: WineryAmenity[] | undefined = await WineryAmenity.find({
                where: {wineryId: winery.id}
            });

            return {
                winery: {
                    ...winery,
                    wineType: wineTypesOfWinery.map((wt)=>wt.wineType),
                    productionType: prodTypesOfWinery.map((pt)=>pt.productionType),
                    supportedLanguages: languages.map((lan)=>lan.supportedLanguage),
                    amenities: amenities.map((amen) => amen.amenity)
                },
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

    @Query(() => WineryGetPreSignedUrl)
    async preSignedUrl(
        @Arg('fileName', () => String) fileName : string,
        @Arg('wineryId', () => Int) wineryId : number
    ): Promise<WineryGetPreSignedUrl> {
        try {
            const presigned = await getPresignedUrl(fileName, wineryId, WINERYALBUM) 
            return presigned;
        } catch (error) {
            return error
        }
        
    }
}