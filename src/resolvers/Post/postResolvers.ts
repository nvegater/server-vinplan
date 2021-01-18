import {Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware} from "type-graphql"
import {Post} from "../../entities/Post";
import {CreatePostInputs, validateCreatePostInputs} from "./postResolversInputs";
import {FieldError} from "../User/userResolversOutputs";
import {ApolloRedisContext} from "../../apollo-config";
import {PaginatedPosts, PostResponse} from "./postResolversOutputs";
import {isAuth} from "../Universal/utils";
import {getConnection, UpdateResult} from "typeorm";
import {Upvote} from "../../entities/Upvote";
import {
    SQL_QUERY_INSERT_NEW_UPVOTE,
    SQL_QUERY_SELECT_PAGINATED_POSTS, SQL_QUERY_SELECT_PAGINATED_POSTS_USER_LOGGED_IN,
    SQL_QUERY_SELECT_PAGINATED_POSTS_WITH_CURSOR,
    SQL_QUERY_SELECT_PAGINATED_POSTS_WITH_CURSOR_USER_LOGGED_IN,
    SQL_QUERY_UPDATE_POST_POINTS,
    SQL_QUERY_UPDATE_UPVOTE
} from "../Universal/queries";

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
        @Arg('value', () => Int, {
            description: "The user can upvote and downvote. null means, user hasnt upvoted/downvoted"
        }) value: number,
        @Ctx() {req}: ApolloRedisContext
    ) {
        // @ts-ignore
        const {userId} = req.session;

        const isUpvote = value !== -1;
        const realValue = isUpvote ? 1 : -1;

        const upvote = await Upvote.findOne({where: {postId, userId}});

        if (upvote && upvote.value !== realValue) {
            // the user has voted on the post before and they're changing their vote-
            await getConnection().transaction(async transactionManager => {
                await transactionManager.query(SQL_QUERY_UPDATE_UPVOTE, [realValue, postId, userId])
                await transactionManager.query(SQL_QUERY_UPDATE_POST_POINTS, [2 * realValue, postId])
            });
        } else if (!upvote) {
            // has never vote before
            await getConnection().transaction(async transactionManager => {
                await transactionManager.query(SQL_QUERY_INSERT_NEW_UPVOTE, [userId, postId, realValue]);
                await transactionManager.query(SQL_QUERY_UPDATE_POST_POINTS, [realValue, postId])
            });
        }
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
        @Ctx() {req}: ApolloRedisContext
    ): Promise<PaginatedPosts> {
        // @ts-ignore
        const {userId} = req.session;

        const realLimit = Math.min(50, limit);
        let resultPosts: Post[];

        if (cursor) {
            if (userId) {
                const replacements: any = [realLimit + 1, userId, new Date(parseInt(cursor))];
                resultPosts = await getConnection().query(
                    SQL_QUERY_SELECT_PAGINATED_POSTS_WITH_CURSOR_USER_LOGGED_IN,
                    replacements
                );
            } else {
                const replacements: any = [realLimit + 1, new Date(parseInt(cursor))];
                resultPosts = await getConnection().query(SQL_QUERY_SELECT_PAGINATED_POSTS_WITH_CURSOR, replacements);
            }
        } else {
            if (userId) {
                const replacements: any = [realLimit + 1, userId];
                resultPosts = await getConnection().query(
                    SQL_QUERY_SELECT_PAGINATED_POSTS_USER_LOGGED_IN,
                    replacements
                );
            } else {
                const replacements: any = [realLimit + 1];
                resultPosts = await getConnection().query(SQL_QUERY_SELECT_PAGINATED_POSTS, replacements);
            }
        }

        return {
            paginatedPosts: resultPosts.slice(0, realLimit), // return only the requested posts
            morePostsAvailable: resultPosts.length === (realLimit + 1) // DB has more posts than requested
        };
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id', () => Int) id: number,
    ): Promise<Post | undefined> {
        return Post.findOne(id, {relations: ["creator"]});
    }

    @Mutation(() => PostResponse)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('options') createPostInputs: CreatePostInputs,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<PostResponse> {
        // @ts-ignore
        const {userId} = req.session;

        const inputErrors: FieldError[] = validateCreatePostInputs(createPostInputs);
        if (inputErrors.length > 0) {
            return {errors: inputErrors}
        }
        const postPromise = await Post
            .create({
                ...createPostInputs,
                creatorId: userId,
            }).save();
        return {post: postPromise};
    }

    @Mutation(() => Post, {nullable: true})
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String) title: string,
        @Arg('text', () => String) text: string,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<Post | null> {
        // @ts-ignore
        const {userId} = req.session;
        const updateProccessObject:UpdateResult = await getConnection()
            .createQueryBuilder()
            .update(Post)
            .set({title,text})
            .where('id = :id and "creatorId" = :creatorId', {id, creatorId:userId})
            .returning("*")
            .execute();
        return updateProccessObject.raw[0] as Post
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg('id', () => Int, {
            description: "each user can delete a post they created if theyre logged in"
        }) id: number, @Ctx() {req}: ApolloRedisContext
    ): Promise<boolean> {
        // @ts-ignore
        const {userId} = req.session;
        const post = await Post.findOne(id)

        if (post && userId !== post.creatorId) {
            throw new Error("Not authorized")
        }

        await Post.delete({id, creatorId: userId})
        return true;
    }
}