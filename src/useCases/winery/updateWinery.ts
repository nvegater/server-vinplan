import WineryServices from "../../dataServices/winery";
import {FieldError} from "../../resolvers/User/userResolversOutputs";
import {UpdateWineryInputs} from "../../resolvers/Winery/wineryResolversInputs"
import {WineryServicesResponse} from "../../resolvers/Winery/wineryResolversOutputs";
import WineryGrapesServicesResponse from "../../dataServices/wineryGrapes";
import {Grape} from "../../entities/WineGrapesProduction"
import WineryOtherServicesResponse from "../../dataServices/wineryOthersServices";
import {OtherServices} from "../../entities/WineryOtherServices"
import WineProductionTypeServices from "../../dataServices/wineProductionType";
import {ProductionType} from "../../entities/WineProductionType"
import WineTypeServices from "../../dataServices/wineType";
import {TypeWine} from "../../entities/WineType"
import wineryLanguajeServices from "../../dataServices/wineryLanguage";
import {SupportedLanguage} from "../../entities/WineryLanguage"
import wineryAmenityServices from "../../dataServices/wineryAmenity";
import {Amenity} from "../../entities/WineryAmenity";
import {deleteImageFromS3} from "../../utils/s3Utilities"

import {arrayAreEquals, getDifferentsElements} from "../../utils/arrayUtilities"

const updateWinery = async(updateWineryInputs : UpdateWineryInputs) : Promise<WineryServicesResponse> => {
    try {
        //TODO: refactorizar
        const winery:any = await saveWineryWithOwnData(updateWineryInputs);

        const arrayPromises = [];

        if (updateWineryInputs.wineGrapesProduction) {
            arrayPromises.push(saveWineryGrapesProduction(updateWineryInputs.id, updateWineryInputs.wineGrapesProduction))
        }
        
        if (updateWineryInputs.othersServices) {
            arrayPromises.push(saveWineryOtherServices(updateWineryInputs.id, updateWineryInputs.othersServices))
        }

        if (updateWineryInputs.productionType) {
            arrayPromises.push(saveWineryProductionType(updateWineryInputs.id, updateWineryInputs.productionType))
        }

        if (updateWineryInputs.wineType){
            arrayPromises.push(saveWineryWineType(updateWineryInputs.id, updateWineryInputs.wineType))
        }
        
        if (updateWineryInputs.supportedLanguages){
            arrayPromises.push(saveWinerySupportedLanguages(updateWineryInputs.id, updateWineryInputs.supportedLanguages))
        }

        if (updateWineryInputs.amenities){
            arrayPromises.push(saveWineryAmenity(updateWineryInputs.id, updateWineryInputs.amenities))
        }


        await Promise.all(arrayPromises);
        if (winery) {
            return {
                winery: {
                    ...winery,
                    wineType: [],
                    productionType: [],
                    supportedLanguages: [],
                    amenities: []
                },
                images: [],
                services: []
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
    }
    catch (err) {
        throw new Error(err)
    }
}

const saveWineryGrapesProduction = async (id : number, wineGrapesProduction:Grape[]) => {
    const wineGrapesF = await WineryGrapesServicesResponse.getWineGrapesById(id);
    const wineGrapesFound = wineGrapesF.map(grapes => grapes.wineGrapesProduction);
    if (!arrayAreEquals(wineGrapesFound, wineGrapesProduction)){
        //son diferentes
        //se van a insertar
        getDifferentsElements(wineGrapesProduction,wineGrapesFound)
        .forEach(async (grape) => {
            await WineryGrapesServicesResponse.insertGrapesToWinery(id, grape)
        })
        //se van a eliminar 
        getDifferentsElements(wineGrapesFound, wineGrapesProduction)
        .forEach(async (grape) => await WineryGrapesServicesResponse.deleteGrapesToWinery(id, grape))
    }
}

const saveWineryOtherServices = async (id : number, othersServices:OtherServices[]) => {
    const servicesF = await WineryOtherServicesResponse.getWineryOtherServicesById(id);
    const servicesFound = servicesF.map(oServices => oServices.service);
    
    if (!arrayAreEquals(servicesFound, othersServices)){
        //son diferentes
        //se van a insertar
        getDifferentsElements(othersServices,servicesFound)
        .forEach(async (service) => {
            await WineryOtherServicesResponse.insertOtherServiceToWinery(id, service)
        })
        //se van a eliminar 
        getDifferentsElements(servicesFound, othersServices)
        .forEach(async (service) => await WineryOtherServicesResponse.deleteOtherServiceToWinery(id, service))
    }
}

const saveWineryProductionType = async (id : number, productionType:ProductionType[]) => {
    const productionTypesF = await WineProductionTypeServices.getProductionTypeByWineryId(id);
    const productionTypesFound = productionTypesF.map(prodType => prodType.productionType);
    
    if (!arrayAreEquals(productionTypesFound, productionType)){
        //son diferentes
        //se van a insertar
        getDifferentsElements(productionType,productionTypesFound)
        .forEach(async (productionT) => {
            await WineProductionTypeServices.insertProductionTypeToWinery(id, productionT)
        })
        //se van a eliminar 
        getDifferentsElements(productionTypesFound, productionType)
        .forEach(async (productionT) => await WineProductionTypeServices.deleteProductionTypeToWinery(id, productionT))
    }
}

const saveWineryWineType = async (id : number, wineType:TypeWine[]) => {
    const wineTypesF = await WineTypeServices.getWineTypeByWineryId(id)
    const wineTypesFound = wineTypesF.map(wineType => wineType.wineType);
    
    if (!arrayAreEquals(wineTypesFound, wineType)){
        //son diferentes
        //se van a insertar
        getDifferentsElements(wineType,wineTypesFound)
        .forEach(async (wineT) => {
            await WineTypeServices.insertWineTypeToWinery(id, wineT)
        })
        //se van a eliminar 
        getDifferentsElements(wineTypesFound, wineType)
        .forEach(async (wineT) => await WineTypeServices.deleteWineTypeToWinery(id, wineT))
    }
}

const saveWinerySupportedLanguages = async (id : number, supportedLanguages:SupportedLanguage[]) => {
    const wineSupportedLanguajesF = await wineryLanguajeServices.getWineryLanguageByWineryId(id)
    const wineSupportedLanguajesFound = wineSupportedLanguajesF.map(supportLanguaje => supportLanguaje.supportedLanguage);
    
    if (!arrayAreEquals(wineSupportedLanguajesFound, supportedLanguages)){
        //son diferentes
        //se van a insertar
        getDifferentsElements(supportedLanguages,wineSupportedLanguajesFound)
        .forEach(async (supportL) => {
            await wineryLanguajeServices.insertSupportedLanguajeToWinery(id, supportL)
        })
        //se van a eliminar 
        getDifferentsElements(wineSupportedLanguajesFound, supportedLanguages)
        .forEach(async (supportL) => await wineryLanguajeServices.deleteSupportedLanguajeToWinery(id, supportL))
    }
}

const saveWineryAmenity = async (id : number, amenity:Amenity[]) => {
    const wineryAmenitiesF = await wineryAmenityServices.getWineryAmenityByWineryId(id)
    const wineryAmenitiesFound = wineryAmenitiesF.map(wineryAmenities => wineryAmenities.amenity);
    
    if (!arrayAreEquals(wineryAmenitiesFound, amenity)){
        //son diferentes
        //se van a insertar
        getDifferentsElements(amenity,wineryAmenitiesFound)
        .forEach(async (amenity) => {
            await wineryAmenityServices.insertAmenityToWinery(id, amenity)
        })
        //se van a eliminar 
        getDifferentsElements(wineryAmenitiesFound, amenity)
        .forEach(async (amenity) => await wineryAmenityServices.deleteAmenityToWinery(id, amenity))
    }
}

const saveWineryWithOwnData = async (updateWineryInputs: UpdateWineryInputs) => {
    try {
        const winery: any = await WineryServices.findWineryById(updateWineryInputs.id);
        if (updateWineryInputs.logo && (winery.logo != updateWineryInputs.logo)){
            if (winery.logo) {
                await deleteImageFromS3(winery.logo); 
            }
        }
        winery.id = updateWineryInputs.id;
        winery.name = updateWineryInputs.name;
        winery.description = updateWineryInputs.description;
        winery.foundationYear = updateWineryInputs.foundationYear;
        winery.googleMapsUrl = updateWineryInputs.googleMapsUrl;
        winery.yearlyWineProduction = updateWineryInputs.yearlyWineProduction;
        winery.contactEmail = updateWineryInputs.contactEmail;
        winery.contactPhoneNumber = updateWineryInputs.contactPhoneNumber;
        winery.covidLabel = updateWineryInputs.covidLabel;
        winery.logo = updateWineryInputs.logo;
        winery.contactName = updateWineryInputs.contactName;
        winery.productRegion = updateWineryInputs.productRegion;
        winery.postalAddress = updateWineryInputs.postalAddress;
        winery.architecturalReferences = updateWineryInputs.architecturalReferences;
        winery.enologoName = updateWineryInputs.enologoName;
        winery.younerFriendly = updateWineryInputs.younerFriendly;
        winery.petFriendly = updateWineryInputs.petFriendly;
        winery.handicappedFriendly = updateWineryInputs.handicappedFriendly;
        winery.valley = updateWineryInputs.valley;
        await WineryServices.updateWinery(winery);
        return winery;
    } catch (error) {
        throw new Error(error);
    }
    
}

export default updateWinery;