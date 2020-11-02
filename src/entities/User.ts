import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class User {

    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({type: 'date'})
    createdAt = new Date();

    @Field(() => String)
    @Property({type: 'date', onUpdate: () => new Date()})
    updatedAt = new Date();

    // If I dont want to expose a field I can just comment out the field decorator
    @Field()
    @Property({type: 'text', unique:true})
    username!: string;

    @Field()
    @Property({type: 'text', unique:true})
    email!: string;

    // No field() annotation so no queriable by graphql
    @Property({type: 'text'})
    password!: string;

}