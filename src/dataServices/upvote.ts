import { Upvote } from "../entities/Upvote";
import { getConnection } from "typeorm";
import {
  SQL_QUERY_UPDATE_UPVOTE,
  SQL_QUERY_UPDATE_POST_POINTS,
  SQL_QUERY_INSERT_NEW_UPVOTE,
} from "../resolvers/Universal/queries";

const findVoteByUserAndPost = async (postId: number, userId: number) => {
  return await Upvote.findOne({ where: { postId, userId } });
};

const changeVote = async (
  postId: number,
  userId: number,
  realValue: number
) => {
  return await getConnection().transaction(async (transactionManager) => {
    await transactionManager.query(SQL_QUERY_UPDATE_UPVOTE, [
      realValue,
      postId,
      userId,
    ]);
    await transactionManager.query(SQL_QUERY_UPDATE_POST_POINTS, [
      2 * realValue,
      postId,
    ]);
  });
};

const vote = async (postId: number, userId: number, realValue: number) => {
  return await getConnection().transaction(async (transactionManager) => {
    await transactionManager.query(SQL_QUERY_INSERT_NEW_UPVOTE, [
      userId,
      postId,
      realValue,
    ]);
    await transactionManager.query(SQL_QUERY_UPDATE_POST_POINTS, [
      realValue,
      postId,
    ]);
  });
};

export default { findVoteByUserAndPost, changeVote, vote };
