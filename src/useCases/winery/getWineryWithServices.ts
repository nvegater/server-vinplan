import {Service} from "../../entities/Service";
import {Winery} from "../../entities/Winery";
import {WineType} from "../../entities/WineType";
import {WineProductionType} from "../../entities/WineProductionType";
import {WineryLanguage} from "../../entities/WineryLanguage";
import {WineryAmenity} from "../../entities/WineryAmenity";
import {WineryImageGallery} from "../../entities/WineryImageGallery"
import {FieldError} from "../../resolvers/User/userResolversOutputs";
import {WineryServicesResponse} from "../../resolvers/Winery/wineryResolversOutputs";

const getWineryWithServices = async(wineryId : number) : Promise<WineryServicesResponse> => {
    try {
        const wineryWithServices = await Service.find({where: {wineryId: wineryId}})
        const winery:any = await Winery.findOne(wineryId);
        const wineryImages: WineryImageGallery[] | undefined = await WineryImageGallery.find({
            where: {wineryId: wineryId}
        })

        if (wineryWithServices && winery) {
            const wineTypesOfWinery: WineType[] | undefined = await WineType.find({
                where: {wineryId: winery.id}
            });
            const prodTypesOfWinery: WineProductionType[] | undefined = await WineProductionType.find({
                where: {wineryId: winery.id}
            });

            const languages: WineryLanguage[] | undefined = await WineryLanguage.find({
                where: {wineryId: winery.id}
            });

            const amenities: WineryAmenity[] | undefined = await WineryAmenity.find({
                where: {wineryId: winery.id}
            });

            return {
                winery: {
                    ...winery,
                    wineType: wineTypesOfWinery.map((wt)=>wt.wineType),
                    productionType: prodTypesOfWinery.map((pt)=>pt.productionType),
                    supportedLanguages: languages.map((lan)=>lan.supportedLanguage),
                    amenities: amenities.map((amen) => amen.amenity)
                },
                images: wineryImages,
                services: wineryWithServices
            }
        } else {
            const fieldError: FieldError = {
                field: "Winery with services",
                message: "Not services found for this winery"
            }
            return {
                errors: [fieldError]
            }
        }
    } catch (error) {
        throw new Error(error)
    }
};

export default getWineryWithServices;
