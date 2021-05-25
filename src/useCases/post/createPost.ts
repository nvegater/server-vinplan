import {postCreation} from "../../resolvers/Post/postResolversOutputs";
//import posts from "../../dataServices/posts"
import {CreatePostInputs} from "../../resolvers/Post/postResolversInputs";
import {Post} from "../../entities/Post";
import {validateCreatePostInputs} from "../../resolvers/Post/postResolversInputs";

const updatePost = async (createPostInputs : CreatePostInputs, userId : number): Promise<postCreation> => {
    try{

        const inputErrors = validateCreatePostInputs(createPostInputs);
        if (inputErrors.length > 0) {
            return {errors: [{
                field: 'imageId',
                message : "La imagen no se puede borrar"
            }]}
        }else{
        const postPromise = await Post
            .create({
                ...createPostInputs,
                creatorId: userId,
            }).save();

            if(postPromise == undefined ){
                return {errors: [{
                    field: 'imageId',
                    message : "La imagen no se puede borrar"
                }]}
            }else{
                //return updateProccessObject.raw[0] as Post;
                return {post : postPromise}
            }
        }
        // return {post: postPromise};

        // const updateProccessObject:UpdateResult = await getConnection()
        //     .createQueryBuilder()
        //     .update(Post)
        //     .set({title,text})
        //     .where('id = :id and "creatorId" = :creatorId', {id, creatorId:userId})
        //     .returning("*")
        //     .execute();
        // if(updateProccessObject.raw[0] == undefined ){
        //     return {errors: [{
        //         field: 'imageId',
        //         message : "La imagen no se puede borrar"
        //     }], updated : false}
        // }else{
        //     //return updateProccessObject.raw[0] as Post;
        //     return {updated : true}
        // }
    } catch (error) {
        throw new Error(error)
    }
}

export default updatePost;