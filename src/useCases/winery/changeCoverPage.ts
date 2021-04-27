import WineryImageGalleryServices from "../../dataServices/wineryImageGallery"

const changeCoverPage = async (wineryId: number, wineryImageId: number): Promise<Boolean> => {
    try {
        const changedImage = await WineryImageGalleryServices.changeCoverPage(wineryId, wineryImageId)
        console.log(changedImage);
        return true;
        // if (wineryInserted === undefined) {
        //     return {errors: [userResolversErrors.imageNotInserted]}
        // } else {
        //     const wineryImages: WineryImageGallery[] | undefined = await WineryImageGalleryServices.getWineryGalleryById(wineryId)
        //     return {images: wineryImages};
        // }
    } catch (error) {
        throw new Error(error)
    }
}

export default changeCoverPage;