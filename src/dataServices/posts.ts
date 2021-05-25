import {Post} from "../entities/Post"
import {getConnection} from "typeorm";

const findPostById = async (postId: number) => {
    return await Post.findOne(postId);
}

const updatePostById = async (postId: number, userId : number, title : string, text : string) => {
    return await getConnection()
    .createQueryBuilder()
    .update(Post)
    .set({title,text})
    .where('id = :id and "creatorId" = :creatorId', {postId, creatorId:userId})
    .returning("*")
    .execute();
}

export default {
    findPostById,
    updatePostById
}