import {PostResponse} from "../../resolvers/Post/postResolversOutputs";
import {UpdateResult} from "typeorm";
import postsServices from "../../dataServices/posts"

const updatePost = async (id : number, userId : number, title : string, text : string): Promise<PostResponse> => {
    try{
        const updatedPost: UpdateResult = await postsServices.updatePostByIdAndCreatorId(id, userId, title, text);
        if (updatedPost.affected || updatedPost.affected != 0) {
            return {post: updatedPost.raw[0]}; 
        } else {
            return {errors: [{
                field: 'id',
                message : "Error al actualizar el post"
            }]}
         }
    } catch (error) {
        throw new Error(error)
    }
}

export default updatePost;