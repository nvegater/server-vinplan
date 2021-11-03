import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../../entities/Post";
import { CreatePostInputs } from "./postResolversInputs";
import { ApolloRedisContext } from "../../apollo-config";
import {
  PaginatedPosts,
  postDeletion,
  PostResponse,
} from "./postResolversOutputs";
import { isAuth } from "../Universal/utils";
import deletePost from "../../useCases/post/deletePost";
import updatePost from "../../useCases/post/updatePost";
import createPost from "../../useCases/post/createPost";
import showPost from "../../useCases/post/showPost";
import votePost from "../../useCases/post/votePost";

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(
    // Extra graphql Field, but not from the DB-> Main entity.
    @Root() root: Post
  ) {
    return root.text.slice(0, 50);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int, {
      description:
        "The user can upvote and downvote. null means, user hasnt upvoted/downvoted",
    })
    value: number,
    @Ctx() { req }: ApolloRedisContext
  ): Promise<Boolean> {
    try {
      // @ts-ignore
      const { userId } = req.session;
      return await votePost(value, postId, userId);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => PaginatedPosts)
  async PaginatedPosts(
    @Arg("limit", () => Int, {
      description: "For pagination." + "Max number of posts. Default is 50",
    })
    limit: number,
    @Arg("cursor", () => String, {
      nullable: true,
      description:
        "For pagination." +
        "Offset=10 means, retrieve the 10th post. Cursor in contrast depends on the sorting" +
        "Default sorting: (createdAt, DESC) (new first)" +
        "The cursor accepts a string timestamp, the createdAt." +
        "Returns all the posts after the given timestamp",
    })
    cursor: string | null,
    @Ctx() { req }: ApolloRedisContext
  ): Promise<PaginatedPosts> {
    try {
      // @ts-ignore
      const { userId } = req.session;
      return await showPost(limit, cursor, userId);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id, { relations: ["creator"] });
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async postCreation(
    @Arg("options") createPostInputs: CreatePostInputs,
    @Ctx() { req }: ApolloRedisContext
  ): Promise<PostResponse> {
    try {
      // @ts-ignore
      const { userId } = req.session;
      return await createPost(createPostInputs, userId);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async postUpdate(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Arg("text", () => String) text: string,
    @Ctx() { req }: ApolloRedisContext
  ): Promise<PostResponse> {
    try {
      // @ts-ignore
      const { userId } = req.session;
      return await updatePost(id, userId, title, text);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => postDeletion)
  @UseMiddleware(isAuth)
  async postDeletion(
    @Arg("id", () => Int, {
      description:
        "each user can delete a post they created if theyre logged in",
    })
    id: number,
    @Ctx() { req }: ApolloRedisContext
  ): Promise<postDeletion> {
    try {
      // @ts-ignore
      const { userId } = req.session;
      return await deletePost(id, userId);
    } catch (error) {
      throw new Error(error);
    }
  }
}
