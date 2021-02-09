import {Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Service} from "../../entities/Service";
import {CreateServiceResponse, ServiceResponse} from "./serviceResolversOutputs";
import {FieldError} from "../User/userResolversOutputs";
import {getConnection, UpdateResult} from "typeorm";
import {SQL_QUERY_INSERT_RESERVATION, SQL_QUERY_SELECT_SERVICES_WITH_WINERY} from "../Universal/queries";
import {isAuth} from "../Universal/utils";
import {ApolloRedisContext} from "../../apollo-config";
import {ServiceReservation} from "../../entities/ServiceReservation";
import {CreateServiceInputs, FrequencyRuleInputs, UpdateServiceInputs} from "./serviceResolversInputs";
import {intervalToDuration} from 'date-fns';
import {FrequencyRule} from "../../entities/FrequencyRule";


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

    @Mutation(() => CreateServiceResponse)
    @UseMiddleware(isAuth)
    async createService(
        @Arg('createServiceInputs') createServiceInputs: CreateServiceInputs,
        @Arg('frequencyRuleInputs', {nullable: true}) frequencyRuleInputs: FrequencyRuleInputs,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<CreateServiceResponse> {
        // @ts-ignore
        const {userId} = req.session;
        // validate winery
        const service = await Service.findOne({where: {title: createServiceInputs.title}});
        if (!service) {
            // create Frequency Rule and save it. Copy the ID in the service
            const frequencyRule = frequencyRuleInputs ? await FrequencyRule.create({
                frequency: frequencyRuleInputs.frequency
            }) : null;

            if (frequencyRule) {
                await frequencyRule.save()
            }
            const frequencyRuleId = !!frequencyRule ? frequencyRule.id : undefined;

            const service = await Service.create({
                ...createServiceInputs,
                creatorId: userId,
                duration: intervalToDuration({
                    start: createServiceInputs.startTime,
                    end: createServiceInputs.endTime
                }).minutes,
                frequencyRuleId: frequencyRuleId
            });
            service.save();
            return {service: service};
        } else {
            const error: FieldError = {
                field: "createService",
                message: "Service with that title already exists"
            }
            return {errors: [error]}
        }

    }

    @Mutation(() => CreateServiceResponse)
    @UseMiddleware(isAuth)
    async updateService(
        @Arg('updateServiceInputs') updateServiceInputs: UpdateServiceInputs,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<CreateServiceResponse> {
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
            .where('id = :id and "creatorId" = :creatorId', {id, creatorId: userId})
            .returning("*")
            .execute();
        if (updateService.affected === 0) {
            const error: FieldError = {
                field: "updateService",
                message: "no change was made"
            }
            return {errors: [error]}
        }
        return {service: updateService.raw[0] as Service};
    }


}