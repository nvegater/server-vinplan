import {getConnection} from "typeorm";
import {WineryImageGallery} from "../../entities/WineryImageGallery"
import userResolversErrors from "../../resolvers/User/userResolversErrors";
import {WineryImageGalleryResponse} from "../../resolvers/Winery/wineryResolversOutputs"

const insertImage = async (wineryId: number, urlImage: string): Promise<WineryImageGalleryResponse> => {
    try {
        const wineryInserted = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(WineryImageGallery)
            .values([
                { "wineryId": wineryId, "imageUrl": urlImage }
            ])
            .returning('*')
            .execute();
        
        if (wineryInserted === undefined) {
            return {errors: [userResolversErrors.imageNotInserted]}
        } else {
            const wineryImages: WineryImageGallery[] | undefined = await WineryImageGallery.find({
                where: {wineryId: wineryId}
            })
            return {images: wineryImages}
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default insertImage;