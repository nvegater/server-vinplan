import { postDeletion } from "../../resolvers/Post/postResolversOutputs";
import posts from "../../dataServices/posts";

const deletePost = async (
  id: number,
  userId: number
): Promise<postDeletion> => {
  try {
    const post = await posts.findPostById(id);
    if (post && userId !== post.creatorId) {
      return {
        errors: [
          {
            field: "Id de usuario",
            message: "Error con el ID de usuario",
          },
        ],
        deleted: false,
      };
    } else {
      return { deleted: true };
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default deletePost;
