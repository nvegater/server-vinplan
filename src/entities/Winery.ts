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
import {Service} from "./Service";

@Entity()
export class Winery extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({type: "int"})
    foundationYear: number;

    // Winery posts multiple wineEvents. Each wineEvent done by user.
    @OneToMany(() => WineEvent, wineEvent => wineEvent.winery)
    wineEvent: WineEvent[];

    //FK
    @Column()
    creatorId: number;

    @ManyToOne(() => User, user => user.winery)
    creator: User;

    @OneToMany(() => Service, service => service.offeredBy)
    services: Service[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}