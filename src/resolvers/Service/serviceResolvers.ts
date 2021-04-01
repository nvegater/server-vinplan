import {Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Service} from "../../entities/Service";
import {BookServiceResponse, CreateServiceResponse, ServiceResponse} from "./serviceResolversOutputs";
import {FieldError} from "../User/userResolversOutputs";
import {getConnection, MoreThan, Not, UpdateResult} from "typeorm";
import {
    SQL_QUERY_INSERT_RESERVATION,
    SQL_QUERY_SELECT_SERVICES_WITH_WINERY,
    SQL_QUERY_UPDATE_RESERVATION
} from "../Universal/queries";
import {isAuth} from "../Universal/utils";
import {ApolloRedisContext} from "../../apollo-config";
import {ServiceReservation} from "../../entities/ServiceReservation";
import {CreateServiceInputs, UpdateServiceInputs} from "./serviceResolversInputs";
import {addMinutes} from "date-fns";


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
    async servicesBookedWinery(
        @Ctx() {req}: ApolloRedisContext
    ): Promise<ServiceResponse> {
        // @ts-ignore
        const {userId} = req.session;
        const paginatedServicesDB = await Service.findAndCount({
            where: {creatorId: userId, noOfAttendees: MoreThan(0)}
        })
        return {
            paginatedServices: paginatedServicesDB[0],
            moreServicesAvailable: false
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
        @Arg('startDateTime', () => Date) startDateTime: Date,
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
            if (serviceToBook) {
                // if startDate is different, is booking one of the recurrent instances
                const bookingRecurrentInstance = startDateTime !== serviceToBook.startDateTime;
                if (bookingRecurrentInstance) {
                    // check if there is already a recurrant instance for this date.
                    // get Service where startDate = from args and parent Id = serviceId
                    const recurrentInstanceFromService = await Service.findOne({
                        where: {parentServiceId: serviceId, startDateTime: startDateTime}
                    })
                    if (recurrentInstanceFromService) {
                        // Do normal booking process
                        if (recurrentInstanceFromService.noOfAttendees < recurrentInstanceFromService.limitOfAttendees) {
                            // update the noOfAttendes
                            const newId = recurrentInstanceFromService.id;
                            const newIdCreator = recurrentInstanceFromService.creatorId;
                            const updateService: UpdateResult = await getConnection().createQueryBuilder()
                                .update(Service)
                                .set({
                                    noOfAttendees: recurrentInstanceFromService.noOfAttendees + noOfAttendees
                                })
                                .where('id = :id and "creatorId" = :creatorId', {id: newId, creatorId: newIdCreator})
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
                                await getConnection().transaction(async transactionManager => {
                                    let createOrUpdate = SQL_QUERY_INSERT_RESERVATION;
                                    const reservationExists = await ServiceReservation.findOne({
                                        where: {
                                            serviceId: newId,
                                            userId: userId
                                        }
                                    })
                                    if (reservationExists) {
                                        createOrUpdate = SQL_QUERY_UPDATE_RESERVATION
                                    }
                                    await transactionManager.query(createOrUpdate, [newId, userId, noOfAttendees]);
                                });
                                return {service: updateService.raw[0] as Service};
                            }
                        } else {
                            const error: FieldError = {
                                field: "updateServiceFull",
                                message: "service is full"
                            }
                            return {errors: [error]}
                        }
                    } else {
                        // Create the instance and book it
                        const newEndDateTime = addMinutes(startDateTime, serviceToBook.duration)
                        const newRecurrentInstanceFromService = await Service.create({
                            // Copy props from parent event
                            wineryId: serviceToBook.wineryId,
                            limitOfAttendees: serviceToBook.limitOfAttendees,
                            pricePerPersonInDollars: serviceToBook.pricePerPersonInDollars,
                            title: serviceToBook.title,
                            description: serviceToBook.description,
                            eventType: serviceToBook.eventType,
                            duration: serviceToBook.duration,
                            creatorId: serviceToBook.creatorId,
                            // new props
                            parentServiceId: serviceToBook.id,
                            startDateTime: startDateTime,
                            endDateTime: newEndDateTime,
                            noOfAttendees: noOfAttendees
                        })
                        await newRecurrentInstanceFromService.save();
                        // Insert the reservation after service update
                        await getConnection().transaction(async transactionManager => {
                            await transactionManager.query(SQL_QUERY_INSERT_RESERVATION,
                                [newRecurrentInstanceFromService.id, userId, noOfAttendees]);
                        });
                        return {service: newRecurrentInstanceFromService};
                    }
                }
                // do normal Booking Proccess
                if (serviceToBook.noOfAttendees < serviceToBook.limitOfAttendees) {
                    // update the noOfAttendes
                    const updateService: UpdateResult = await getConnection().createQueryBuilder()
                        .update(Service)
                        .set({
                            noOfAttendees: serviceToBook.noOfAttendees + noOfAttendees
                        })
                        .where('id = :id and "creatorId" = :creatorId', {serviceId, creatorId: serviceToBook.creatorId})
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
                    field: "yourOwnService",
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
                duration: createServiceInputs.duration
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