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