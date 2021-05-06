import {
    BaseEntity, Column, CreateDateColumn,
    Entity,
    ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from "typeorm";
import {Winery} from "./Winery";
import {Length} from "class-validator";
import {Field, Float, Int, ObjectType, registerEnumType} from "type-graphql";
import {ServiceReservation} from "./ServiceReservation";
import {User} from "./User";

export enum EventType {
    COMIDA_CENA_MARIDAJE = "Comida/Cena Maridaje",
    DEGUSTACION = "Degustación",
    CONCIERTO = "Concierto"
}

registerEnumType(EventType, {
    name: "EventType",
    description: "Type of service"
});

@ObjectType()
@Entity()
export class Service extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Length(63)
    @Column({length: 63})
    title!: string;

    @Field(() => String)
    @Length(255)
    @Column({length: 255})
    description!: string;

    @Field(() => EventType)
    @Column('enum', {name: 'eventType', enum: EventType})
    eventType: EventType;

    @Field(() => Date)
    @Column({type: "timestamp"})
    startDateTime!: Date;

    @Field(() => Date)
    @Column({type: "timestamp"})
    endDateTime!: Date;

    @Field(()=>[String], {nullable:true})
    @Column("text", {array: true, nullable: true, default: "{}"})
    rRules: string[];

    @Field(() => Int)
    @Column()
    wineryId!: number;

    @Field(() => Winery)
    @ManyToOne(() => Winery, (winery) => winery.services)
    winery!: Winery;

    //FK
    @Field()
    @Column()
    creatorId: number;

    @Field(() => Int, {nullable:true})
    @Column({nullable: true})
    parentServiceId: number;

    @Field(() => User)
    @ManyToOne(() => User, user => user.services)
    creator: User;

    @Field(() => Int)
    @Column({nullable: false})
    duration: number;

    @Field(() => Int, {nullable: true})
    @Column({type:"int", nullable: true})
    limitOfAttendees: number;

    @Field(() => Int, {defaultValue: 0})
    @Column({type:"int", default: () => 0})
    noOfAttendees: number;

    @Field(() => Float)
    @Column({type: "float"})
    pricePerPersonInDollars: number;

    // Service receives multiple reservations. Each reservation done by user.
    @OneToMany(() => ServiceReservation, serviceReservation => serviceReservation.service)
    reservations: ServiceReservation[];

    @Field(() => Date)
    @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
    public updatedAt: Date;


}