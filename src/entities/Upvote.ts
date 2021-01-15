import {BaseEntity, Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";
import {Post} from "./Post";

// m to n -> Many to Many
// user <---> posts : many users upvote a post & users upvote many posts.
// user <--- join table ---> posts
// user <--- upvote ----> posts

@Entity()
export class Upvote extends BaseEntity {

    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    postId: number;

    @Column({type: "int"})
    value: number;


    @ManyToOne(() => User, (user) => user.upvotes)
    user: User;

    @ManyToOne(() => Post, (post)=> post.upvotes, {
        onDelete: "CASCADE"
    })
    post: Post; // If a post is deleted, Deleted the Upvote itself.
}