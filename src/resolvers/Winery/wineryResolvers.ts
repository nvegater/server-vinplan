import {Arg, Int, Query, Resolver, Mutation} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";
import {WineriesResponse, WineryServicesResponse, WineryGetPreSignedUrlResponse} from "./wineryResolversOutputs";
import {Winery} from "../../entities/Winery";
import {getConnection, In} from "typeorm";
import {SQL_QUERY_SELECT_WINERIES} from "../Universal/queries";
import {WineType} from "../../entities/WineType";
import {WineProductionType} from "../../entities/WineProductionType";
import {getPresignedUrl} from "../../utils/s3Utilities"
import {WineryImageGallery} from "../../entities/WineryImageGallery"
import {WineryImageGalleryResponse} from "../../resolvers/Winery/wineryResolversOutputs"
import {WINERYALBUM} from "../../constants"
import getWineryWithServices from "../../useCases/winery/getWineryWithServices"
import insertImage from "../../useCases/winery/insertImage"

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

        return await getWineryWithServices(wineryId);
    }

    @Query(() => WineryGetPreSignedUrlResponse)
    async preSignedUrl(
        @Arg('fileName', () => String) fileName : string,
        @Arg('wineryId', () => Int) wineryId : number
    ): Promise<WineryGetPreSignedUrlResponse> {
        try {
            const presigned = await getPresignedUrl(fileName, wineryId, WINERYALBUM) 
            return presigned;
        } catch (error) {
            return error
        }
    }

    @Mutation(() => WineryServicesResponse)
    async insertImageWinery(
        @Arg('wineryId', () => Int) wineryId: number,
        @Arg('urlImage', () => String) urlImage: string,
    ): Promise<WineryServicesResponse> {
        try {
            const insertImageResponse : WineryImageGalleryResponse = await insertImage(wineryId,urlImage);

            const wineryInfo : WineryServicesResponse = await getWineryWithServices(wineryId);
            const wineryImages: WineryImageGallery[] | undefined = insertImageResponse.images

            if (!wineryInfo.errors) {
                return {
                    ...wineryInfo,
                    images: wineryImages
                }
            } else {
                return {
                    errors : wineryInfo.errors
                }
            }
            
        } catch (error) {
            throw new Error(error)
        }
    }
}