import {Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Service} from "../../entities/Service";
import {
    BookServiceResponse,
    CreateServiceResponse,
    ServiceResponse,
    UpdateServiceResponse, FindExperienceResponse
} from "./serviceResolversOutputs";
import {isAuth} from "../Universal/utils";
import {ApolloRedisContext} from "../../apollo-config";
import {ServiceInsertImageResponse, ServiceDeleteImageResponse, ServiceCoverImageChangeResponse} from "./serviceResolversOutputs"
import insertImage from "../../useCases/service/insertImage"
import deleteImage from "../../useCases/service/deleteImage"
import changeCoverPicture from "../../useCases/service/changeCoverPicture"
import {CreateServiceInputs, ReserveServiceInputs, UpdateServiceInputs} from "./serviceResolversInputs";
import reserve from "../../useCases/service/reserve";
import getServices from "../../useCases/service/getServices";
import showServices from "../../useCases/service/showServices";
import createService from "../../useCases/service/createService";
import updateService from "../../useCases/service/updateService";
import findExperienceById from "../../useCases/service/findExperienceById";

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

    @Query(() => FindExperienceResponse)
    async findExperienceById(
        @Arg('experienceId', () => Int) experienceId: number
    ): Promise<FindExperienceResponse> {
        return await findExperienceById(experienceId);
    };

    @Mutation(() => CreateServiceResponse)
    @UseMiddleware(isAuth)
    async updateService(
        @Arg('updateServiceInputs') updateServiceInputs: UpdateServiceInputs,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<UpdateServiceResponse> {
        // @ts-ignore
        const {userId} = req.session;
        
        return await updateService(updateServiceInputs, userId);
    }

    @Mutation(() => ServiceInsertImageResponse)
    async insertImageService(
        @Arg('serviceId', () => Int) serviceId: number,
        @Arg('urlImage', () => [String]) urlImage: string[],
    ): Promise<ServiceInsertImageResponse> {
        try {            
            return await insertImage(serviceId,urlImage)
        } catch (error) {
            throw new Error(error)
        }
    }

    @Mutation(() => ServiceDeleteImageResponse)
    async deleteImageService(
        @Arg('serviceId', () => Int) serviceId: number,
    ): Promise<ServiceDeleteImageResponse> {
        try {            
            return await deleteImage(serviceId)
        } catch (error) {
            throw new Error(error)
        }
    }

    @Mutation(() => ServiceCoverImageChangeResponse)
    async changeCoverPageImageService(
        @Arg('serviceId', () => Int) serviceId: number,
        @Arg('serviceImageId', () => Int) serviceImageId: number,
    ): Promise<ServiceCoverImageChangeResponse> {
        try {
            return await changeCoverPicture(serviceId,serviceImageId)
        } catch (error) {
            throw new Error(error)
        }
    }
}