import {
    BaseEntity, Column,
    Entity,
    ManyToOne, PrimaryGeneratedColumn,
} from "typeorm";
import {Winery} from "./Winery";

@Entity()
export class WineEvent extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    wineryId: number;

    @ManyToOne(() => Winery, (winery)=> winery.wineEvent)
    winery: Winery;

    @Column()
    description!: string;

    @Column({nullable:false})
    duration: number;

    @Column({type: "float"})
    pricePerPersonInDollars: number;

    @Column({nullable:true})
    startDate: Date;

    @Column({nullable:true})
    endDate: Date;


}