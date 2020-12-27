import {ObjectType} from "type-graphql";
import {BaseEntity, Entity} from "typeorm";

// m to n -> Many to Many
// user <---> posts : many users upvote a post & users upvote many posts.
// user <--- join table ---> posts
// user <--- upvote ----> posts

@ObjectType()
@Entity()
export class Upvotes extends BaseEntity {

}