import { Winery } from "../entities/Winery";
import CreateWineryInputs from "../resolvers/Inputs/CreateWineryInputs";
import { UserInputs } from "../resolvers/Inputs/UserInputs";
import { WineType } from "../entities/WineType";

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

  return wineryEntity;
};
