import {EntityManager} from "@mikro-orm/core/dist/EntityManager";

/**
 * Cross-App types
 * **/
export type ApolloORMContext = {
    postgres_mikroORM_EM: EntityManager;
}