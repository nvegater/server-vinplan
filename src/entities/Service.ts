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
import {FrequencyRule} from "./FrequencyRule";

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
    @Column({type: "date"})
    startDate!: Date;


    @Field(() => Date, {nullable: true})
    @Column({type: "date", nullable: true})
    endDate: Date;

    @Field(() => Date)
    @Column("timestamp")
    startTime: Date;

    @Field(() => Date)
    @Column({type: "timestamp", precision: 6, nullable: true})
    endTime: Date;

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

    @Field(() => User)
    @ManyToOne(() => User, user => user.services)
    creator: User;

    // Frequency Rules are unique. Multiple services can reference the same frequence rule
    @Field({nullable: true})
    @Column({nullable: true})
    frequencyRuleId: number;

    @Field(() => FrequencyRule, {nullable: true})
    @ManyToOne(() => FrequencyRule, frequencyRule => frequencyRule.services, {nullable: true})
    frequencyRule?: FrequencyRule;

    @Field(() => Int)
    @Column({nullable: false})
    duration: number;

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