import { postCreation } from "../../resolvers/Post/postResolversOutputs";
import { CreatePostInputs } from "../../resolvers/Post/postResolversInputs";
import posts from "../../dataServices/posts";
import { validateCreatePostInputs } from "../../resolvers/Post/postResolversInputs";

const createPost = async (
  createPostInputs: CreatePostInputs,
  userId: number
): Promise<postCreation> => {
  try {
    const inputErrors = validateCreatePostInputs(createPostInputs);
    if (inputErrors.length > 0) {
      return {
        errors: [
          {
            field: "options",
            message: "No hay datos que ingresar",
          },
        ],
      };
    } else {
      const postPromise = await posts.createNewPost(createPostInputs, userId);
      if (postPromise == undefined) {
        return {
          errors: [
            {
              field: "post promise",
              message: "Fallò la inserciòn de datos",
            },
          ],
        };
      } else {
        return { post: postPromise };
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default createPost;
