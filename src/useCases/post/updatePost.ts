import {postUpdate} from "../../resolvers/Post/postResolversOutputs";
import {getConnection, UpdateResult} from "typeorm";
//import posts from "../../dataServices/posts"
import {Post} from "../../entities/Post";

const updatePost = async (id : number, userId : number, title : string, text : string): Promise<postUpdate> => {
    try{
        // const updatedPost : UpdateResult = await posts.updatePostById(id, userId, title, text);
        // if (updatedPost.affected || updatedPost.affected != 0) {
        //     return {updated: true}; 
        // } else {
        //     return {errors: [{
        //         field: 'imageId',
        //         message : "La imagen no se puede borrar"
        //     }], updated : false}
        //  }

        const updateProccessObject:UpdateResult = await getConnection()
            .createQueryBuilder()
            .update(Post)
            .set({title,text})
            .where('id = :id and "creatorId" = :creatorId', {id, creatorId:userId})
            .returning("*")
            .execute();
        if(updateProccessObject.raw[0] == undefined ){
            return {errors: [{
                field: 'imageId',
                message : "La imagen no se puede borrar"
            }], updated : false}
        }else{
            //return updateProccessObject.raw[0] as Post;
            return {updated : true}
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default updatePost;