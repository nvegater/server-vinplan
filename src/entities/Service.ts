import {
    BaseEntity, Column, CreateDateColumn,
    Entity,
    ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from "typeorm";
import {Winery} from "./Winery";
import {Length} from "class-validator";
import {Field, Float, Int, ObjectType} from "type-graphql";
import {ServiceReservation} from "./ServiceReservation";

export enum EventType {
    COMIDA_CENA_MARIDAJE="Comida/Cena Maridaje",
    DEGUSTACION="Degustación",
    CONCIERTO="Concierto"
}

@ObjectType()
@Entity()
export class Service extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Length(63)
    @Column({ length: 63 })
    title!: string;

    @Field(() => String)
    @Length(255)
    @Column({ length: 255 })
    description!: string;

    @Field(() => String)
    @Column('enum', { name: 'eventType', enum: EventType})
    eventType: EventType;

    @Field(() => String)
    @Column({ type: "date" })
    startDate!: Date;


    @Field(() => String,{nullable:true})
    @Column({type: "date", nullable:true})
    endDate: Date;

    @Field(() => String)
    @Column("timestamp")
    startTime: Date;

    @Field(() => String)
    @Column({ type: "timestamp", precision: 6, nullable: true })
    endTime: Date;

    @Column()
    wineryId!: number;

    @Field(()=>Winery)
    @ManyToOne(() => Winery, (winery)=> winery.services)
    winery!: Winery;

    @Field(() => Int)
    @Column({nullable:false})
    duration: number;

    @Field(() => Float)
    @Column({type: "float"})
    pricePerPersonInDollars: number;

    // Service receives multiple reservations. Each reservation done by user.
    @OneToMany(() => ServiceReservation, serviceReservation => serviceReservation.service)
    reservations: ServiceReservation[];

    @Field(() => String)
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;


}