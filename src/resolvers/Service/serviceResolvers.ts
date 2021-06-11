import {Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Service} from "../../entities/Service";
import {BookServiceResponse, CreateServiceResponse, ServiceResponse} from "./serviceResolversOutputs";
import {isAuth} from "../Universal/utils";
import {ApolloRedisContext} from "../../apollo-config";
import {CreateServiceInputs, ReserveServiceInputs, UpdateServiceInputs} from "./serviceResolversInputs";
import reserve from "../../useCases/service/reserve";
import getServices from "../../useCases/service/getServices";
import showServices from "../../useCases/service/showServices";
import createService from "../../useCases/service/createService";

@Resolver(Service)
export class ServiceResolver {

    @Query(() => ServiceResponse)
    async allServices(
        @Arg('limit', () => Int, {
            description: "For pagination." +
                "Max number of posts. Default is 50"
        }) limit: number
    ): Promise<ServiceResponse> {
        return await showServices(limit);
    };

    @Query(() => ServiceResponse)
    @UseMiddleware(isAuth)
    async servicesUser(
        @Arg('serviceIds', () => [Int]) serviceIds: number[]
    ): Promise<ServiceResponse> {
       return await getServices(serviceIds)
    };

    @Mutation(() => BookServiceResponse)
    @UseMiddleware(isAuth)
    async reserve(
        @Arg('reserveServiceInputs') reserveServiceInputs: ReserveServiceInputs,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<BookServiceResponse> {
        // @ts-ignore
        const {userId} = req.session;
        return await reserve({userId, ...reserveServiceInputs})

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
        return await createService(createServiceInputs, userId);
    }

    @Mutation(() => CreateServiceResponse)
    @UseMiddleware(isAuth)
    async updateService(
        @Arg('updateServiceInputs') updateServiceInputs: UpdateServiceInputs,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<CreateServiceResponse> {
        // @ts-ignore
        const {userId} = req.session;
        
        return await this.updateService(updateServiceInputs, userId);
    }


}