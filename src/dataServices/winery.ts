import { Valley, Winery } from "../entities/Winery";
import CreateWineryInputs from "../resolvers/Inputs/CreateWineryInputs";
import { UserInputs } from "../resolvers/Inputs/UserInputs";
import { WineType } from "../entities/WineType";
import { getConnection, getRepository } from "typeorm";
import { typeReturn } from "./utils";

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

export const updateWineryAccountCreationTime = async (
  wineryAlias: string,
  createdTime: number
): Promise<Winery> => {
  return await typeReturn<Winery>(
    getConnection()
      .createQueryBuilder()
      .update(Winery)
      .set({ accountCreatedTime: createdTime })
      .where("urlAlias = :wineryAlias", {
        wineryAlias,
      })
      .returning("*")
      .execute()
  );
};

export const findWineriesByValley = async (valley: Valley[]) => {
  return await getRepository(Winery)
    .createQueryBuilder("winery")
    .where('winery."valley" IN (:...valley)', { valley: valley })
    .getMany();
};
