import {Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Service} from "../../entities/Service";
import {ServiceResponse} from "./serviceResolversOutputs";
import {FieldError} from "../User/userResolversOutputs";
import {getConnection, UpdateResult} from "typeorm";
import {SQL_QUERY_INSERT_RESERVATION, SQL_QUERY_SELECT_SERVICES_WITH_WINERY} from "../Universal/queries";
import {isAuth} from "../Universal/utils";
import {ApolloRedisContext} from "../../apollo-config";
import {ServiceReservation} from "../../entities/ServiceReservation";
import {CreateServiceInputs, UpdateServiceInputs} from "./serviceResolversInputs";
import {Winery} from "../../entities/Winery";

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

    @Query(() => ServiceResponse)
    @UseMiddleware(isAuth)
    async servicesUser(
        @Arg('serviceIds', () => [Int]) serviceIds: number[]
    ): Promise<ServiceResponse> {

        const paginatedServicesDB = await Service.findByIds(serviceIds, {relations: ["winery"]})
        if (paginatedServicesDB !== undefined) {
            return {
                paginatedServices: paginatedServicesDB,
                moreServicesAvailable: false // DB has more posts than requested
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
            const serviceToBook = Service.findOne({where: {id: serviceId}})
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

    @Mutation(() => Service)
    @UseMiddleware(isAuth)
    async createService(
        @Arg('createServiceInputs') createServiceInputs: CreateServiceInputs,
        @Ctx() {req}: ApolloRedisContext
    ) {
        // @ts-ignore
        const {userId} = req.session;
        // validate winery
        const winery = await Winery.findOne(createServiceInputs.wineryId);
        if (winery) {
            const service = await Service.create({
                ...createServiceInputs,
                creatorId: userId
            });
            service.save();
        }

    }

    @Mutation(() => Service)
    @UseMiddleware(isAuth)
    async updateService(
        @Arg('updateServiceInputs') updateServiceInputs: UpdateServiceInputs,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<Service | null> {
        // @ts-ignore
        const {userId} = req.session;
        const {
            title, id,
            description,
            eventType,
            pricePerPersonInDollars,
            startDate, endDate, startTime, endTime
        } = updateServiceInputs;
        const updateService: UpdateResult = await getConnection().createQueryBuilder()
            .update(Service)
            .set({
                title,
                description,
                eventType,
                pricePerPersonInDollars,
                startDate, endDate, startTime, endTime
            })
            .where('id = :id and "creatorId" = :creatorId', {id, creatorId:userId})
            .returning("*")
            .execute();
        return updateService.raw[0] as Service;
    }


}