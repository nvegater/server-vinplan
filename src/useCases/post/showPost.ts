import { PaginatedPosts } from "../../resolvers/Post/postResolversOutputs";
import posts from "../../dataServices/posts";
import { Post } from "../../entities/Post";

const showPost = async (
  limit: number,
  cursor: string | null,
  userId: number
): Promise<PaginatedPosts> => {
  try {
    const realLimit = Math.min(50, limit);
    let resultPosts: Post[];

    if (cursor) {
      if (userId) {
        resultPosts = await posts.PostsWithCursorUserLogged(
          limit,
          userId,
          cursor
        );
      } else {
        resultPosts = await posts.PostsWithCursor(limit, cursor);
      }
    } else {
      if (userId) {
        resultPosts = await posts.PostsUserLogged(limit, userId);
      } else {
        resultPosts = resultPosts = await posts.posts(limit);
      }
    }
    return {
      paginatedPosts: resultPosts.slice(0, realLimit), // return only the requested posts
      morePostsAvailable: resultPosts.length === realLimit + 1, // DB has more posts than requested
    };
  } catch (error) {
    throw new Error(error);
  }
};

export default showPost;
