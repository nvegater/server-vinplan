import {Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Service} from "../../entities/Service";
import {BookServiceResponse, CreateServiceResponse, ServiceResponse} from "./serviceResolversOutputs";
import {FieldError} from "../User/userResolversOutputs";
import {getConnection, Not, UpdateResult} from "typeorm";
import {SQL_QUERY_INSERT_RESERVATION, SQL_QUERY_SELECT_SERVICES_WITH_WINERY} from "../Universal/queries";
import {isAuth} from "../Universal/utils";
import {ApolloRedisContext} from "../../apollo-config";
import {ServiceReservation} from "../../entities/ServiceReservation";
import {CreateServiceInputs, UpdateServiceInputs} from "./serviceResolversInputs";
import differenceInMinutes from 'date-fns/differenceInMinutes';


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

    @Mutation(() => BookServiceResponse)
    @UseMiddleware(isAuth)
    async reserve(
        @Arg('serviceId', () => Int) serviceId: number,
        @Arg('noOfAttendees', () => Int) noOfAttendees: number,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<BookServiceResponse> {
        // @ts-ignore
        const {userId} = req.session;

        const reservation = await ServiceReservation
            .findOne({where: {serviceId, userId}});

        if (reservation) {
            const error: FieldError = {
                field: "updateService",
                message: "the user has reserved the service already."
            }
            return {errors: [error]}
        } else {
            const serviceToBook = await Service.findOne({
                where: {id: serviceId, creatorId: Not(userId)} // creator cant book its own service
            })
            console.log(serviceToBook)
            if (serviceToBook) {
                // check that its not full
                if (serviceToBook.noOfAttendees < serviceToBook.limitOfAttendees) {
                    // update the noOfAttendes
                    const updateService: UpdateResult = await getConnection().createQueryBuilder()
                        .update(Service)
                        .set({
                            noOfAttendees: serviceToBook.noOfAttendees + noOfAttendees
                        })
                        .where('id = :id and "creatorId" = :creatorId', {serviceId, creatorId: userId})
                        .returning("*")
                        .execute();
                    // If the update doesnt work dont insert the reservation
                    if (updateService.affected === 0) {
                        const error: FieldError = {
                            field: "updateService",
                            message: "no change was made"
                        }
                        return {errors: [error]}
                    } else {
                    // Insert the reservation after service update
                        await getConnection().transaction(async transactionManager => {
                            await transactionManager.query(SQL_QUERY_INSERT_RESERVATION, [serviceId, userId, noOfAttendees]);
                        });
                        return {service: updateService.raw[0] as Service};
                    }
                } else {
                    const error: FieldError = {
                        field: "updateService",
                        message: "service is full"
                    }
                    return {errors: [error]}
                }
            } else {
                const error: FieldError = {
                    field: "updateService",
                    message: "youre trying to book a service you created"
                }
                return {errors: [error]}
            }
        }

    }

    @Mutation(() => CreateServiceResponse)
    @UseMiddleware(isAuth)
    async createService(
        @Arg('createServiceInputs') createServiceInputs: CreateServiceInputs,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<CreateServiceResponse> {
        // @ts-ignore
        const {userId} = req.session;
        // validate winery
        const service = await Service.findOne({where: {title: createServiceInputs.title}});
        if (!service) {
            const service = await Service.create({
                ...createServiceInputs,
                creatorId: userId,
                duration: differenceInMinutes(createServiceInputs.endDateTime, createServiceInputs.startDateTime)
            });
            await service.save();
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
            startDateTime, endDateTime
        } = updateServiceInputs;
        const updateService: UpdateResult = await getConnection().createQueryBuilder()
            .update(Service)
            .set({
                title,
                description,
                eventType,
                pricePerPersonInDollars,
                startDateTime,
                endDateTime
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