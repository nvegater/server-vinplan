import {Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware} from "type-graphql"
import {Post} from "../../entities/Post";
import {CreatePostInputs, validateCreatePostInputs} from "./postResolversInputs";
import {FieldError} from "../User/userResolversOutputs";
import {ApolloRedisContext} from "../../apollo-config";
import {PostResponse} from "./postResolversOutputs";
import {isAuth} from "../Universal/utils";
import {getConnection} from "typeorm";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(
        @Arg('limit', () => Int,{
            description: "For pagination." +
                "Max number of posts. Default is 50"
        }) limit: number,
        @Arg('cursor', () => String, {
            nullable: true,
            description: "For pagination." +
                "Offset=10 means, retrieve the 10th post. Cursor in contrast depends on the sorting" +
                "Default sorting: (createdAt, DESC) (new first)" +
                "The cursor accepts a string timestamp, the createdAt." +
                "Returns all the posts after the given timestamp"
        }) cursor: string | null,
    ): Promise<Post[]> {
        const realLimit = Math.min(50, limit);
        const queryBuilder = getConnection()
            .getRepository(Post)
            .createQueryBuilder("posts")
            .orderBy('"createdAt"', "DESC")
            .take(realLimit);
        if (cursor) {
            queryBuilder
                .where('"createdAt" < :cursor', {cursor: new Date(parseInt(cursor))})
        }
        return queryBuilder.getMany();
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id', () => Int) id: number,
    ): Promise<Post | undefined> {
        return Post.findOne(id);
    }

    @Mutation(() => PostResponse)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('options') createPostInputs: CreatePostInputs,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<PostResponse> {
        const inputErrors: FieldError[] = validateCreatePostInputs(createPostInputs);
        if (inputErrors.length > 0) {
            return {errors: inputErrors}
        }
        const postPromise = await Post
            .create({
                ...createPostInputs,
                // @ts-ignore
                creatorId: req.session.userId,
            }).save();
        return {post: postPromise};
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String, {nullable: true}) title: string,
    ): Promise<Post | null> {
        const post = await Post.findOne(id) // or {where:id}
        if (!post) {
            return null
        }
        if (typeof title !== "undefined") {
            await Post.update({id}, {title})
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
        await Post.delete(id)
        return true;
    }
}