import {Field, ObjectType} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";
import {Service} from "../../entities/Service";
import {ServiceImageGallery} from "../../entities/ServiceImageGallery"

@ObjectType()
export class ServiceResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => [Service], {nullable: true})
    paginatedServices?: Service[]
    @Field()
    moreServicesAvailable: boolean;
}

@ObjectType()
export class PaginatedExperiences {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => [Service], {nullable: true})
    experiences?: Service[]
    @Field()
    moreExperiencesAvailable: boolean;
}

@ObjectType()
export class CreateServiceResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Service, {nullable: true})
    service?: Service
}

@ObjectType()
export class FindExperienceResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Service, {nullable: true})
    service?: Service
}

@ObjectType()
export class UpdateServiceResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Service, {nullable: true})
    service?: Service
}

@ObjectType()
export class ServiceServicesResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Service)
    service?: Service;
    @Field(() => [ServiceImageGallery])
    images?: ServiceImageGallery[];
    @Field(()=>[Service])
    services?: Service[];
}

@ObjectType()
export class ServiceImageGalleryResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => [ServiceImageGallery])
    images?: ServiceImageGallery[];
}

@ObjectType()
export class ServiceImageResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Boolean)
    success?: Boolean;
}

@ObjectType()
export class ServiceCoverImageChangeResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Boolean)
    changed?: Boolean;
}

@ObjectType()
export class BookServiceResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Service, {nullable: true})
    service?: Service
}