import {Arg, Int, Query, Resolver, Mutation} from "type-graphql";
import {WineriesResponse, WineryServicesResponse, WineryChangeResponse} from "./wineryResolversOutputs";
import {Winery} from "../../entities/Winery";
import {WineryImageGallery} from "../../entities/WineryImageGallery"
import {WineryImageGalleryResponse} from "./wineryResolversOutputs"
import getWineryWithServices from "../../useCases/winery/getWineryWithServices"
import insertImage from "../../useCases/winery/insertImage"
import deleteImage from "../../useCases/winery/deleteImage"
import changeCoverPage from "../../useCases/winery/changeCoverPage"
import {WineryDeleteImageResponse} from "./wineryResolversOutputs";
import showWineries from "../../useCases/winery/showWineries";

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
        return await showWineries(limit);
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
        @Arg('urlImage', () => [String]) urlImage: string[],
    ): Promise<WineryServicesResponse> {
        try {
            const insertImageResponse : WineryImageGalleryResponse = await insertImage(wineryId,urlImage);
            const wineryInfo : WineryServicesResponse = await getWineryWithServices(wineryId);
            const wineryImages: WineryImageGallery[] | undefined = insertImageResponse.images
            if (!wineryInfo.errors) {
                return {
                    ...wineryInfo,
                    images: wineryImages,
                    errors: insertImageResponse.errors
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

    @Mutation(() => WineryDeleteImageResponse)
    async deleteImageWinery(
        @Arg('imageId', () => Int) imageId: number,
    ): Promise<WineryDeleteImageResponse> {
        try {            
            return await deleteImage(imageId)
        } catch (error) {
            throw new Error(error)
        }
    }

    @Mutation(() => WineryChangeResponse)
    async changeCoverPageImageWinery(
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