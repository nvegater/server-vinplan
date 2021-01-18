import {BaseEntity, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";
import {WineEvent} from "./WineEvent";

@Entity()
export class ServiceReservation extends BaseEntity {

    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    eventId: number;

    @ManyToOne(() => User, (user) => user.reservedServices)
    user: User;

    @ManyToOne(() => WineEvent, (wineEvent)=> wineEvent.reservations, {
        onDelete: "CASCADE"
    })
    service: WineEvent;
}