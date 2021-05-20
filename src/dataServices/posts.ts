import {Post} from "../entities/Post"

const findPostById = async (postId: number) => {
    return await Post.findOne(postId);
}

export default {
    findPostById,
}