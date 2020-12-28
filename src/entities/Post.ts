import {Field, Int, ObjectType} from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User";
import {Upvote} from "./Upvote";

@ObjectType()
@Entity()
export class Post extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    text!: string;

    @Field()
    @Column({type: "int", default: 0})
    points!: number;

    // Post receives multiple upvotes. Each upvote done by user.
    @OneToMany(() => Upvote, upvote => upvote.post)
    upvotes: Upvote[];

    @Field(() => Int, {nullable: true})
    voteStatus: number | null; // 1 or -1 or null

    //FK
    @Field()
    @Column()
    creatorId: number;

    @Field()
    @ManyToOne(() => User, user => user.post)
    creator: User;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}