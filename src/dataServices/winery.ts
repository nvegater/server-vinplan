import { Winery } from "../entities/Winery";
import CreateWineryInputs from "../resolvers/Inputs/CreateWineryInputs";
import { UserInputs } from "../resolvers/Inputs/UserInputs";
import { WineType } from "../entities/WineType";
import { SupportedLanguage } from "../entities/WineryLanguage";
import { Amenity } from "../entities/WineryAmenity";
import {
  DeleteResult,
  getConnection,
  InsertResult,
  UpdateResult,
} from "typeorm";
import { WineProductionType } from "../entities/WineProductionType";

export const getWineryByUsername_DS = async (creatorUsername: string) => {
  return await Winery.findOne({
    where: {
      creatorUsername: creatorUsername,
    },
  });
};

export const getWineryByAlias_DS = async (urlAlias: string) => {
  return await Winery.findOne({
    where: {
      urlAlias: urlAlias,
    },
  });
};

interface CreateWineryProps_DS {
  winery: CreateWineryInputs;
  user: UserInputs;
  stripeCustomerId: string;
}
type CreateWineryFn_DS = (props: CreateWineryProps_DS) => Promise<Winery>;
export const createWinery_DS: CreateWineryFn_DS = async ({
  winery,
  user,
  stripeCustomerId,
}) => {
  const wineryEntity = Winery.create({
    ...winery,
    stripe_customerId: stripeCustomerId,
    creatorUsername: user.username,
    creatorEmail: user.email,
    subscription: winery.subscription,
    wineType: [], // TODO: Nico make this fields optional
    productionType: [],
    supportedLanguages: [],
    amenities: [], // // TODO: Nico make this fields optional
  });
  await wineryEntity.save();

  const wineTypes = winery.wineType.map((wineType) => {
    return WineType.create({
      wineryId: wineryEntity.id,
      wineType: wineType,
    });
  });

  wineTypes.map(async (wineTypeEntity) => {
    await wineTypeEntity.save();
  });

  // TODO dont create Enum create Entity
  const productionTypes = winery.productionType.map((productionType) => {
    return WineProductionType.create({
      wineryId: wineryEntity.id,
      productionType: productionType,
    });
  });

  productionTypes.map(async (productionTypeEntity) => {
    await productionTypeEntity.save();
  });

  // TODO dont use enums
  const supportedLangs = winery.supportedLanguages.map((supportedLanguages) => {
    return SupportedLanguage.create({
      wineryId: wineryEntity.id,
      wineType: supportedLanguages,
    });
  });

  supportedLangs.map(async (supportedLanguagesEntity) => {
    await supportedLanguagesEntity.save();
  });

  // TODO dont use enums
  const Amenities = winery.amenities.map((amenities) => {
    return Amenity.create({
      wineryId: wineryEntity.id,
      wineType: amenities,
    });
  });

  Amenities.map(async (amenitiesEntity) => {
    await amenitiesEntity.save();
  });

  return wineryEntity;
};

const typeReturn = async <T>(
  mutation: Promise<UpdateResult | DeleteResult | InsertResult>
): Promise<T> => {
  return await mutation.then((res) => res.raw[0]);
};

export const updateWineryAccountID_DS = async (
  accountId: string,
  wineryAlias: string
): Promise<Winery> => {
  return await typeReturn<Winery>(
    getConnection()
      .createQueryBuilder()
      .update(Winery)
      .set({ accountId: accountId })
      .where("urlAlias = :wineryAlias", {
        wineryAlias,
      })
      .returning("*")
      .execute()
  );
};
