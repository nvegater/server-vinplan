import {BaseEntity, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";
import {Service} from "./Service";

@Entity()
export class ServiceReservation extends BaseEntity {

    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    serviceId: number;

    @ManyToOne(() => User, (user) => user.reservedServices)
    user: User;

    @ManyToOne(() => Service, (service)=> service.reservations, {
        onDelete: "CASCADE"
    })
    service: Service;
}