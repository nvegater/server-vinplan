import {Field, ObjectType} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";
import {Service} from "../../entities/Service";

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
export class CreateServiceResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Service, {nullable: true})
    service?: Service
}

@ObjectType()
export class UpdateServiceResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field()
    service?: boolean
}

@ObjectType()
export class BookServiceResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Service, {nullable: true})
    service?: Service
}