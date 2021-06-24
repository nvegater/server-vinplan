import {WineryImageGallery} from "../../entities/WineryImageGallery"
import wineryResolverErrors from "../../resolvers/Winery/wineryResolversErrors";
import {WineryImageGalleryResponse} from "../../resolvers/Winery/wineryResolversOutputs"
import WineryImageGalleryServices from "../../dataServices/wineryImageGallery"


const insertImage = async (wineryId: number, urlImages: string[]): Promise<WineryImageGalleryResponse> => {
    try {
        const wineriesInserted : WineryImageGallery[] = []
        await urlImages.forEach(async (image) => { 
            const wineryInserted = await WineryImageGalleryServices.insertImageInWineryGallery(wineryId, image)
            wineriesInserted.push(wineryInserted)
        });
        if (wineriesInserted.length != urlImages.length) {
            const wineryImages: WineryImageGallery[] | undefined = await WineryImageGalleryServices.getWineryGalleryById(wineryId)
            return {images : wineryImages};
        } else {
            return {errors: [wineryResolverErrors.imageNotInserted]}
        }
        
    } catch (error) {
        throw new Error(error)
    }
}

export default insertImage;