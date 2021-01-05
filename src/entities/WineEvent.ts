import {
    BaseEntity, Column, CreateDateColumn,
    Entity,
    ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,
} from "typeorm";
import {Winery} from "./Winery";
import {Length} from "class-validator";
import {Field, Int, ObjectType} from "type-graphql";

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

    @Length(63)
    @Column({ length: 63 })
    title!: string;

    @Length(255)
    @Column({ length: 255 })
    description!: string;

    @Column('enum', { name: 'event_type', enum: EventType})
    eventType: string;


    @Column()
    startDate!: Date;


    @Column({nullable:true})
    endDate: Date; // Not needed for recurrent events

    @Column("timestamp")
    startTime: Date;

    @Column({ type: "timestamp", precision: 6, nullable: true })
    endTime: Date;

    @Column()
    wineryId: number;

    @ManyToOne(() => Winery, (winery)=> winery.wineEvent)
    winery: Winery;

    @Column({nullable:false})
    duration: number;

    @Column({type: "float"})
    pricePerPersonInDollars: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;


}