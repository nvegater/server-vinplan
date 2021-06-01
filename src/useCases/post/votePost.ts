import upVoteServices from "../../dataServices/upvote"

const votePost = async (value : number, postId: number, userId: number): Promise<Boolean> => {
    try{
        const isUpvote = value !== -1;
        const realValue = isUpvote ? 1 : -1;
        const upvote = await upVoteServices.findVoteByUserAndPost(postId, userId);
        if (upvote && upvote.value !== realValue) {
            // the user has voted on the post before and they're changing their vote-
            await upVoteServices.changeVote(postId, userId, realValue);
        } else {
            // has never vote before
            await upVoteServices.vote(postId, userId, realValue);
        }
        return true
    } catch (error) {
        throw new Error(error)
    }
}

export default votePost;