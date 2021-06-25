// import userResolversErrors from "../../resolvers/User/userResolversErrors";
import ExperienceImageGalleryServices from "../../dataServices/serviceImageGallery"

const getImagesNumberInGallery = async (idExperience : number) : Promise<number> => {
    try {
        return await ExperienceImageGalleryServices.getImagesNumberGallery(idExperience)
    } catch (error) {
        throw new Error(error)
    }
}

export default getImagesNumberInGallery;