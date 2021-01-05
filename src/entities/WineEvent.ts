import {
    BaseEntity, Column, CreateDateColumn,
    Entity,
    ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,
} from "typeorm";
import {Winery} from "./Winery";
import {Length} from "class-validator";
import {Field, Float, Int, ObjectType} from "type-graphql";

export enum EventType {
    COMIDA_CENA_MARIDAJE="Comida/Cena Maridaje",
    DEGUSTACION="Degustación",
    CONCIERTO="Concierto"
}

@ObjectType()
@Entity()
export class WineEvent extends BaseEntity {

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
    @Column('enum', { name: 'event_type', enum: EventType})
    eventType: string;

    @Field(() => String)
    @Column()
    startDate!: Date;


    @Field(() => String,{nullable:true})
    @Column({nullable:true})
    endDate: Date; // Not needed for recurrent events

    @Field(() => String)
    @Column("timestamp")
    startTime: Date;

    @Field(() => String)
    @Column({ type: "timestamp", precision: 6, nullable: true })
    endTime: Date;

    @Column()
    wineryId!: number;

    @Field(()=>Winery)
    @ManyToOne(() => Winery, (winery)=> winery.wineEvent)
    winery!: Winery;

    @Field(() => Int)
    @Column({nullable:false})
    duration: number;

    @Field(() => Float)
    @Column({type: "float"})
    pricePerPersonInDollars: number;

    @Field(() => String)
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;


}