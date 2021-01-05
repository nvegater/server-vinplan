import {
    BaseEntity,
    Column,
    CreateDateColumn, Entity, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {WineEvent} from "./WineEvent";
import {User} from "./User";
import {Field, Int, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class Winery extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({unique: true})
    name!: string;

    @Field(() => String)
    @Column()
    description!: string;

    @Field(() => Int,{nullable: true})
    @Column({type: "int"})
    foundationYear: number;

    // Winery posts multiple wineEvents. Each wineEvent done by user.
    @Field(()=>[WineEvent])
    @OneToMany(() => WineEvent, wineEvent => wineEvent.winery)
    wineEvent: WineEvent[];

    @Field(() => String)
    @Column()
    googleMapsUrl: string;

    @Field(() => Int,{nullable:true})
    @Column({nullable: true})
    yearlyWineProduction: number;

    //FK
    @Column()
    creatorId: number;

    @ManyToOne(() => User, user => user.winery)
    creator: User;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}