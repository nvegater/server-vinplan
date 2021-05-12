import {Field, ObjectType} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";
import {Winery} from "../../entities/Winery";
import {WineryImageGallery} from "../../entities/WineryImageGallery"
import {Service} from "../../entities/Service";

@ObjectType()
export class WineriesResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => [Winery], {nullable: true})
    paginatedWineries?: Winery[];
    @Field()
    moreWineriesAvailable: boolean;
}

@ObjectType()
export class WineryServicesResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Winery)
    winery?: Winery;
    @Field(() => [WineryImageGallery])
    images?: WineryImageGallery[];
    @Field(()=>[Service])
    services?: Service[];
}

@ObjectType()
export class WineryImageGalleryResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => [WineryImageGallery])
    images?: WineryImageGallery[];
}

@ObjectType()
export class WineryDeleteImageResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Boolean)
    deleted?: Boolean;
}
@ObjectType()
export class WineryChangeResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Boolean)
    changed?: Boolean;
}