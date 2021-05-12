import {Arg, Int, Query, Resolver, Mutation} from "type-graphql";
import {WineriesResponse, WineryServicesResponse, WineryChangeResponse} from "./wineryResolversOutputs";
import {Winery} from "../../entities/Winery";
import {getConnection, In} from "typeorm";
import {SQL_QUERY_SELECT_WINERIES} from "../Universal/queries";
import {WineType} from "../../entities/WineType";
import {WineProductionType} from "../../entities/WineProductionType";
import {WineryImageGallery} from "../../entities/WineryImageGallery"
import {WineryImageGalleryResponse} from "./wineryResolversOutputs"
import getWineryWithServices from "../../useCases/winery/getWineryWithServices"
import insertImage from "../../useCases/winery/insertImage"
import changeCoverPage from "../../useCases/winery/changeCoverPage"
import wineryErrors from "./wineryResolversErrors";
import WineryImageGalleryServices from "../../dataServices/wineryImageGallery";
import {WineryDeleteImageResponse} from "../../resolvers/Winery/wineryResolversOutputs";

//TODO: se debe de separar la logica y la logica de la base de datos
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
            const pagWinsWExtraProps: Winery[] = paginatedWineriesDB.map(async (winery: Winery) => {
                const wineryImages: WineryImageGallery[] | []  = await WineryImageGalleryServices.getWineryGalleryById(winery.id);
                winery.urlImageCover = wineryImages.find((wineryImage : WineryImageGallery) => 
                    wineryImage.coverPage == true
                )?.imageUrl || 'https://dev-vinplan.fra1.digitaloceanspaces.com/winery/1-album/1619825058524/grapes.jpg';
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
            
            return {
                errors: [wineryErrors.wineryNotFound], moreWineriesAvailable: false
            }
        }
    }

    @Query(() => WineryServicesResponse)
    async wineryServices(
        @Arg('wineryId', () => Int) wineryId: number
    ): Promise<WineryServicesResponse> {

        return await getWineryWithServices(wineryId);
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

            if (!wineryInfo.errors && !insertImageResponse.errors) {
                return {
                    ...wineryInfo,
                    images: wineryImages
                }
            } else {
                return {
                    errors : wineryInfo.errors ? wineryInfo.errors : insertImageResponse.errors
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    @Mutation(() => WineryDeleteImageResponse)
    async deleteImageWinery(
        @Arg('imageId', () => Int) imageId: number,
    ): Promise<WineryDeleteImageResponse> {
        try {
            
            const findImageById = async (imageId: number) => {
                return await WineryImageGallery.findOne(imageId);
            }
            
            const imageFound = await findImageById(imageId);
            if (imageFound === undefined) {
                return imageFound
            } else {
                return {field : "image"; message : "image Not Found" }
            }

            const deleteImageResponse : WineryImageGalleryResponse = await deleteImage(imageId);

            if (!deleteImageResponse.errors) {
                return {
                    ...wineryInfo,
                    images: wineryImages
                }
            } else {
                return {
                    errors : deleteImageResponse.errors
                }
            }
            
        } catch (error) {
            throw new Error(error)
        }
    }

    @Mutation(() => WineryChangeResponse)
    async changeCoverPageImage(
        @Arg('wineryId', () => Int) wineryId: number,
        @Arg('wineryImageId', () => Int) wineryImageId: number,
    ): Promise<WineryChangeResponse> {
        try {
            return await changeCoverPage(wineryId,wineryImageId)
        } catch (error) {
            throw new Error(error)
        }
    }
}