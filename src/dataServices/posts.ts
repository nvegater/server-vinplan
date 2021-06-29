import {Post} from "../entities/Post";
import {getConnection} from "typeorm";
import {CreatePostInputs} from "../resolvers/Post/postResolversInputs";
import {
    SQL_QUERY_SELECT_PAGINATED_POSTS, SQL_QUERY_SELECT_PAGINATED_POSTS_USER_LOGGED_IN,
    SQL_QUERY_SELECT_PAGINATED_POSTS_WITH_CURSOR,
    SQL_QUERY_SELECT_PAGINATED_POSTS_WITH_CURSOR_USER_LOGGED_IN,
} from "../resolvers/Universal/queries";

const findPostById = async (postId: number) => {
    return await Post.findOne(postId);
}

const updatePostByIdAndCreatorId = async (id: number, userId : number, title : string, text : string) => {
    return await getConnection()
    .createQueryBuilder()
    .update(Post)
    .set({title,text})
    .where('id = :id and "creatorId" = :creatorId', {id, creatorId:userId})
    .returning("*")
    .execute();
}

const PostsWithCursorUserLogged = async (realLimit: number, userId : number, cursor : string) => {
    const replacements: any = [realLimit + 1, userId, new Date(cursor)];
    return await getConnection().query(
        SQL_QUERY_SELECT_PAGINATED_POSTS_WITH_CURSOR_USER_LOGGED_IN,replacements
    );
}

const PostsWithCursor = async (realLimit: number, cursor : string) => {
    const replacements: any = [realLimit + 1, new Date(cursor)];
    return await getConnection().query(SQL_QUERY_SELECT_PAGINATED_POSTS_WITH_CURSOR, replacements);
}

const PostsUserLogged = async (realLimit: number, userId : number) => {
    const replacements: any = [realLimit + 1, userId];
    return await getConnection().query(
        SQL_QUERY_SELECT_PAGINATED_POSTS_USER_LOGGED_IN, replacements
    );
}

const posts = async (realLimit: number) => {
    const replacements: any = [realLimit + 1];
    return await getConnection().query(SQL_QUERY_SELECT_PAGINATED_POSTS, replacements);
}

const createNewPost = async (createPostInputs : CreatePostInputs, userId : number) => {
    return await Post
    .create({
        ...createPostInputs,
        creatorId: userId,
    }).save();
}

export default {
    findPostById,
    updatePostByIdAndCreatorId,
    createNewPost,
    PostsWithCursorUserLogged,
    PostsWithCursor,
    PostsUserLogged, 
    posts,
}