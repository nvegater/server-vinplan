import ServiceServices from "../../dataServices/service";
import ServiceGalleryServices from "../../dataServices/serviceImageGallery";
import WineryServices from "../../dataServices/winery";
import WineryImageGalleryServices from "../../dataServices/wineryImageGallery";
import WineTypeServices from "../../dataServices/wineType";
import WineProductionTypeServices from "../../dataServices/wineProductionType";
import WineryLanguageServices from "../../dataServices/wineryLanguage";
import WineryAmenityServices from "../../dataServices/wineryAmenity";
import WineryGrapesServices from "../../dataServices/wineryGrapes";
import WineryOthersServicesServices from "../../dataServices/wineryOthersServices";
import { WineProductionType } from "../../entities/WineProductionType";
import { WineryLanguage } from "../../entities/WineryLanguage";
import { WineryAmenity } from "../../entities/WineryAmenity";
import { FieldError } from "../../resolvers/User/userResolversOutputs";
import { WineryServicesResponse } from "../../resolvers/Winery/wineryResolversOutputs";

import { WineryImageGallery } from "../../entities/WineryImageGallery";
import { WineType } from "../../entities/WineType";
import { WineGrapesProduction } from "../../entities/WineGrapesProduction";
import { WineryOtherServices } from "../../entities/WineryOtherServices";

import { Service } from "../../entities/Service";
import { convertDateToUTC } from "../../utils/dateUtils";

const getWineryWithServices = async (
  wineryId: number
): Promise<WineryServicesResponse> => {
  try {
    const wineryWithServices = await ServiceServices.findServicesByWinery(
      wineryId
    );

    const coverImages = await Promise.all(
      wineryWithServices.map(async (ser) => {
        const imageSelected =
          (await ServiceGalleryServices.getCoverImageGallery(ser.id)) ||
          undefined;
        if (imageSelected) {
          return imageSelected.imageUrl;
        } else {
          const defaultData =
            await ServiceGalleryServices.findDefaultImageByEventType(
              ser.eventType
            );
          return defaultData?.defaultImageUrl;
        }
      })
    );

    // correct dates to UTC
    const servicesWithUTCDates: Service[] = wineryWithServices.map((ser, i) => {
      ser.startDateTime = convertDateToUTC(ser.startDateTime);
      ser.endDateTime = convertDateToUTC(ser.endDateTime);
      //TODO: buscar imagen por defecto para cover
      ser.urlImageCover = coverImages[i];
      return ser;
    });
    const winery: any = await WineryServices.findWineryById(wineryId);
    const wineryImages: WineryImageGallery[] | undefined =
      await WineryImageGalleryServices.getWineryGalleryById(wineryId);

    let wineryWithOutCoverPage = true;
    wineryImages.forEach((image) => {
      // se pregunta si no existe el campo coverImage se genera como false
      // si existe y es true no se modifica
      if (image.coverPage != true) {
        image["coverPage"] = false;
        // si encuentro una imagen como cover
      } else {
        wineryWithOutCoverPage = false;
      }
    });

    if (wineryWithOutCoverPage && wineryImages.length > 0) {
      wineryImages[0].coverPage = true;
    }

    if (servicesWithUTCDates && winery) {
      const wineTypesOfWinery: WineType[] | undefined =
        await WineTypeServices.getWineTypeByWineryId(winery.id);
      const prodTypesOfWinery: WineProductionType[] | undefined =
        await WineProductionTypeServices.getProductionTypeByWineryId(winery.id);
      const wineGrapesProduction: WineGrapesProduction[] | undefined =
        await WineryGrapesServices.getWineGrapesById(winery.id);
      const languages: WineryLanguage[] | undefined =
        await WineryLanguageServices.getWineryLanguageByWineryId(winery.id);
      const amenities: WineryAmenity[] | undefined =
        await WineryAmenityServices.getWineryAmenityByWineryId(winery.id);
      const wineryOthersServices: WineryOtherServices[] | undefined =
        await WineryOthersServicesServices.getWineryOtherServicesById(
          winery.id
        );

      return {
        winery: {
          ...winery,
          wineType: wineTypesOfWinery.map((wt) => wt.wineType),
          productionType: prodTypesOfWinery.map((pt) => pt.productionType),
          supportedLanguages: languages.map((lan) => lan.supportedLanguage),
          amenities: amenities.map((amen) => amen.amenity),
          wineGrapesProduction: wineGrapesProduction.map(
            (wg) => wg.wineGrapesProduction
          ),
          othersServices: wineryOthersServices.map((ot) => ot.service),
        },
        images: wineryImages,
        services: servicesWithUTCDates,
      };
    } else {
      const fieldError: FieldError = {
        field: "Winery with services",
        message: "Not services found for this winery",
      };
      return {
        errors: [fieldError],
      };
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default getWineryWithServices;
