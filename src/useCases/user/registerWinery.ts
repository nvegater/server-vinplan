import {Winery} from "../../entities/Winery";
import {WineType} from "../../entities/WineType";
import {WineProductionType} from "../../entities/WineProductionType";
import {WineryLanguage} from "../../entities/WineryLanguage";
import {WineryAmenity} from "../../entities/WineryAmenity";
import {User} from "../../entities/User";
import userDataServices from "src/dataServices/user";
import {FieldError, WineryResponse} from "../../resolvers/User/userResolversOutputs";
import {RegisterInputs, WineryDataInputs, validateInputsRegister} from "../../resolvers/User/userResolversInputs";
import userResolversErrors from "../../resolvers/User/userResolversErrors";

const registerWinery = async (registerInputs : RegisterInputs, wineryDataInputs : WineryDataInputs, userId : number): Promise<WineryResponse> => {
    try {
        const inputErrors: FieldError[] = validateInputsRegister(registerInputs);
        inputErrors.push(...validateInputsRegister(registerInputs))
        if (inputErrors.length > 0) {
            // Level 1: Simple input validation
            return {errors: inputErrors}
        }
        const userWithUsernameExists: User | undefined = await userDataServices.findUserByUsername(registerInputs.username);
        if (userWithUsernameExists) {
            // Level 1
            return {errors: inputErrors.concat(userResolversErrors.usernameInUseError)}
        } else {
            const userWithEmailExists: User | undefined = await userDataServices.findUserByUsername(registerInputs.email);
            if (userWithEmailExists) {
                // Level 2
                return {errors: inputErrors.concat(userResolversErrors.emailInUseError)}
            } else {
                const wineryWithThatNameExists: Winery | undefined = await Winery.findOne({where: {name: wineryDataInputs.name}});
                if (wineryWithThatNameExists) {
                    // Level 3
                    return {errors: inputErrors.concat(userResolversErrors.usernameInUseError)}
                } else {
                    const newUser = await userDataServices.createUser(registerInputs);
                    
                    const creatorId = newUser.id;
                    const newWinery = await userDataServices.createWinery(wineryDataInputs, creatorId);

                    const wineTypes = wineryDataInputs.wineType.map((wineType) => {
                        return WineType.create({
                            wineryId: newWinery.id,
                            wineType: wineType,
                        })
                    })

                    wineTypes.map(async (wineTypeEntity) => {
                        await wineTypeEntity.save();
                    })

                    const productionTypes = wineryDataInputs.productionType.map((productionType) => {
                        return WineProductionType.create({
                            wineryId: newWinery.id,
                            productionType: productionType
                        })
                    })

                    productionTypes.map(async (productionTypeEntity) => {
                        await productionTypeEntity.save();
                    })

                    if (wineryDataInputs.supportedLanguages && wineryDataInputs.supportedLanguages?.length > 0) {
                        wineryDataInputs.supportedLanguages.map(async (supLan) => {
                            const wineLanEntity = WineryLanguage.create({
                                wineryId: newWinery.id,
                                supportedLanguage: supLan
                            });
                            await wineLanEntity.save()
                        });
                    }

                    if (wineryDataInputs.amenities && wineryDataInputs.amenities?.length > 0) {
                        wineryDataInputs.amenities.map(async (amenity) => {
                            const amenityEntity = WineryAmenity.create({
                                wineryId: newWinery.id,
                                amenity: amenity
                            });
                            await amenityEntity.save()
                        });
                    }
                    // @ts-ignore
                    req.session.userId = userId;
                    return {winery: newWinery}
                }
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default registerWinery;