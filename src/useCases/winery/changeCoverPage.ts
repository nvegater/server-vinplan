import WineryImageGalleryServices from "../../dataServices/wineryImageGallery"
import {WineryChangeResponse} from "../../resolvers/Winery/wineryResolversOutputs"
import userResolversErrors from "../../resolvers/User/userResolversErrors";

const changeCoverPage = async (wineryId: number, wineryImageId: number): Promise<WineryChangeResponse> => {
    try {
        const changedImage = await WineryImageGalleryServices.changeCoverPage(wineryId, wineryImageId) || null
        if (changedImage) {
            if (changedImage.error) {
                return {errors: [userResolversErrors.imageNotInserted]}
            } else {
                return {changed: true};
            }
        } else {
            // general error
            return {errors: [userResolversErrors.imageNotInserted]}
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default changeCoverPage;