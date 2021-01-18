import {Field, Int, ObjectType} from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Post} from "./Post";
import {Upvote} from "./Upvote";
import {Winery} from "./Winery";
import {UserType} from "../resolvers/User/userResolversInputs";
import {ServiceReservation} from "./ServiceReservation";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({unique: true})
    username!: string;

    @Field()
    @Column({unique: true})
    email!: string;

    // If I dont want to expose a field I can just comment out the field decorator
    // No field() annotation so no queriable by graphql
    @Column({unique: true})
    password!: string;

    @Column({default: false}) //False: Visitor, True: Owner
    visitorOrOwner!: boolean;

    // User owns multiple wineries.
    @OneToMany(() => Winery, winery => winery.creator)
    winery: Winery[];

    // User create multiple posts.
    @OneToMany(() => Post, post => post.creator)
    post: Post[];

    // User upvote many posts
    @OneToMany(() => Upvote, upvote => upvote.user)
    upvotes: Upvote[];

    @OneToMany(() => ServiceReservation, serviceReservation => serviceReservation.user)
    reservedServices: ServiceReservation[];

    @Field(()=>[Int], {nullable: true})
    reservedServicesIds: number[] | null;

    @Field(() => UserType)
    @Column('enum', { name: 'userType', enum: UserType})
    userType: UserType;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}