import {WineryImageGallery} from "../../entities/WineryImageGallery"
import userResolversErrors from "../../resolvers/User/userResolversErrors";
import {WineryImageGalleryResponse} from "../../resolvers/Winery/wineryResolversOutputs"
import WineryImageGalleryServices from "../../dataServices/wineryImageGallery"

const insertImage = async (wineryId: number, urlImage: string): Promise<WineryImageGalleryResponse> => {
    try {
        const wineryInserted = await WineryImageGalleryServices.insertImageInWineryGallery(wineryId, urlImage)
        
        if (wineryInserted === undefined) {
            return {errors: [userResolversErrors.imageNotInserted]}
        } else {
            const wineryImages: WineryImageGallery[] | undefined = await WineryImageGalleryServices.getWineryGalleryById(wineryId)
            return {images: wineryImages};
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default insertImage;