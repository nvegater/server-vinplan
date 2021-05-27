import {Upvote} from "../entities/Upvote";


const findVoteByUserAndPost = async (postId: number, userId : number) => {
    return await Upvote.findOne({where: {postId, userId}});
}

export default {findVoteByUserAndPost}