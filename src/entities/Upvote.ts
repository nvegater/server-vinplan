import {Field, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, ManyToOne} from "typeorm";
import {User} from "./User";
import {Post} from "./Post";

// m to n -> Many to Many
// user <---> posts : many users upvote a post & users upvote many posts.
// user <--- join table ---> posts
// user <--- upvote ----> posts

@ObjectType()
@Entity()
export class Upvote extends BaseEntity {
    @Field()
    @Column()
    userId: number;

    @Field()
    @ManyToOne(() => User, (user) => user.upvotes)
    user: User;

    @Field()
    @Column()
    postId: number;

    @ManyToOne(() => Post, (post)=> post.upvotes)
    @Column()
    post: Post;
}