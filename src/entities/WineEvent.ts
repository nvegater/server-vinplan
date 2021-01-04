import {
    BaseEntity, Column,
    Entity,
    ManyToOne, PrimaryColumn,
} from "typeorm";
import {Winery} from "./Winery";
import {User} from "./User";

// user <--- join table ---> wineries
// user <--- wineEvents ---> wineries


@Entity()
export class WineEvent extends BaseEntity {

    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    wineryId: number;

    @Column()
    description!: string;

    @Column()
    duration: Date;

    @Column({type: "float"})
    pricePerPersonInDollars: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @ManyToOne(() => User, (user) => user.wineEvent)
    user: User;

    @ManyToOne(() => Winery, (winery)=> winery.wineEvent)
    winery: Winery;

}