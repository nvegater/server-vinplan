import {Field, ObjectType} from "type-graphql";
import {Post} from "../../entities/Post";
import {FieldError} from "../User/userResolversOutputs";

@ObjectType()
export class PostResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Post, {nullable: true})
    post?: Post
}

@ObjectType()
export class PaginatedPosts {
    @Field(() => [Post])
    paginatedPosts: Post[];
    @Field()
    morePostsAvailable: boolean;
}

@ObjectType()
export class postDeletion {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Boolean)
    deleted?: Boolean;
}

@ObjectType()
export class postUpdate {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Boolean)
    updated?: Boolean;
}