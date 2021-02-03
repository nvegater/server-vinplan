import {
    BaseEntity,
    Column,
    CreateDateColumn, Entity, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Service} from "./Service";
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
    @Column({type: "int", nullable: true})
    foundationYear: number;

    // Winery posts multiple wineEvents. Each wineEvent done by user.
    @Field(()=>[Service],{nullable: true})
    @OneToMany(() => Service, service => service.winery)
    services: Service[];

    @Field(() => String,{nullable: true})
    @Column({nullable: true})
    googleMapsUrl: string;

    @Field(() => Int,{nullable:true})
    @Column({nullable: true})
    yearlyWineProduction: number;

    @Field({nullable:true})
    @Column({nullable:true})
    contactEmail: string;

    @Field({nullable:true})
    @Column({nullable:true})
    contactPhoneNumber: string;

    // TODO add valley Enum (single)
    // TODO add production Enum (array) -> many to many
    // TODO add WineType Enum (array) -> many to many

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