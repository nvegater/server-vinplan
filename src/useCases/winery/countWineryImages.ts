// import userResolversErrors from "../../resolvers/User/userResolversErrors";
import WineryImageGalleryServices from "../../dataServices/wineryImageGallery"

const getImagesNumberInGallery = async (idGallery : number) : Promise<Number> => {
    try {
        return await WineryImageGalleryServices.getImagesNumberGallery(idGallery)
    } catch (error) {
        throw new Error(error)
    }
}

export default getImagesNumberInGallery;