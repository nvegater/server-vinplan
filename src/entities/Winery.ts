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

    @Column({unique: true})
    name!: string;

    @Column()
    description!: string;

    @Column({type: "int"})
    foundationYear: number;

    // Winery posts multiple wineEvents. Each wineEvent done by user.
    @OneToMany(() => WineEvent, wineEvent => wineEvent.winery)
    wineEvent: WineEvent[];

    @Column()
    googleMapsUrl: string;

    @Column({nullable: true})
    yearlyWineProduction: number;

    //FK
    @Column()
    creatorId: number;

    @ManyToOne(() => User, user => user.winery)
    creator: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}