import {Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Service} from "../../entities/Service";
import {ServiceResponse} from "./serviceResolversOutputs";
import {FieldError} from "../User/userResolversOutputs";
import {getConnection} from "typeorm";
import {SQL_QUERY_INSERT_RESERVATION, SQL_QUERY_SELECT_SERVICES_WITH_WINERY} from "../Universal/queries";
import {isAuth} from "../Universal/utils";
import {ApolloRedisContext} from "../../apollo-config";
import {ServiceReservation} from "../../entities/ServiceReservation";

@Resolver(Service)
export class ServiceResolver {

    @Query(() => ServiceResponse)
    async allServices(
        @Arg('limit', () => Int, {
            description: "For pagination." +
                "Max number of posts. Default is 50"
        }) limit: number
    ): Promise<ServiceResponse> {
        const realLimit = Math.min(50, limit);
        const replacements = [realLimit + 1]
        const paginatedServicesDB = await getConnection()
            .query(SQL_QUERY_SELECT_SERVICES_WITH_WINERY, replacements);

        if (paginatedServicesDB !== undefined) {
            return {
                paginatedServices: paginatedServicesDB.slice(0, realLimit),
                moreServicesAvailable: paginatedServicesDB.length === (realLimit + 1) // DB has more posts than requested
            };
        } else {
            const fieldError: FieldError = {
                field: "allServices",
                message: "All allServices finding returns undefined"
            }
            return {
                errors: [fieldError],
                moreServicesAvailable: false
            }
        }
    };

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async reserve(
        @Arg('serviceId', () => Int) serviceId: number,
        @Ctx() {req}: ApolloRedisContext
    ) {
        // @ts-ignore
        const {userId} = req.session;

        const reservation = await ServiceReservation
            .findOne({where: {serviceId, userId}});

        if (reservation) {
            // the user has reserved the service already.
            return false
        } else {
            const serviceToBook = Service.findOne({where: {id:serviceId}})
            if (serviceToBook) {
                // service exist
                await getConnection().transaction(async transactionManager => {
                    await transactionManager.query(SQL_QUERY_INSERT_RESERVATION, [serviceId, userId]);
                });
                return true;
            } else {
                // Service doesnt exist
                return false
            }
        }

    }


}