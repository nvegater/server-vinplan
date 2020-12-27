import {Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware} from "type-graphql"
import {Post} from "../../entities/Post";
import {CreatePostInputs, validateCreatePostInputs} from "./postResolversInputs";
import {FieldError} from "../User/userResolversOutputs";
import {ApolloRedisContext} from "../../apollo-config";
import {PaginatedPosts, PostResponse} from "./postResolversOutputs";
import {isAuth} from "../Universal/utils";
import {getConnection} from "typeorm";
import {Upvote} from "../../entities/Upvote";

@Resolver(Post)
export class PostResolver {

    @FieldResolver(() => String)
    textSnippet( // Extra graphql Field, but not from the DB-> Main entity.
        @Root() root: Post
    ) {
        return root.text.slice(0, 50)
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg('postId', () => Int) postId: number,
        @Arg('value', () => Int) value: number,
        @Ctx() {req}: ApolloRedisContext
    ) {
        const isUpvote = value !== -1;
        const realValue = isUpvote ? 1 : -1;

        // @ts-ignore
        const {userId} = req.session;

        await Upvote.insert({
            userId: userId,
            postId,
            value: realValue
        })

        await getConnection().query(`
            update post
            set points = points + $1
            where id = $2
        `, [realValue, postId]);

        return true;

    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit', () => Int, {
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
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit);
        let replacements: any = [realLimit + 1];
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)))
        }
        const posts = await getConnection().query(
            `select p.*, 
            json_build_object(
                'id',u.id,
                'username',u.username,
                'email',u.email,
                'createdAt', u."createdAt",
                'updatedAt', u."updatedAt"
            ) creator
            from post p
            inner join public.user u on u.id = p."creatorId"
            ${cursor ? `where p."createdAt" < $2` : ''}
            order by p."createdAt" DESC
            limit $1
            `, replacements);
        return {
            paginatedPosts: posts.slice(0, realLimit), // return only the requested posts
            morePostsAvailable: posts.length === (realLimit + 1) // DB has more posts than requested
        };
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