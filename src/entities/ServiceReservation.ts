import {BaseEntity, Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";
import {Service} from "./Service";
import {Field, Int, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class ServiceReservation extends BaseEntity {

    @Field(() => Int)
    @PrimaryColumn()
    userId: number;

    @Field(() => Int)
    @PrimaryColumn()
    serviceId: number;

    @Field(() => Int, {nullable: true})
    @Column({type:"int", nullable: true})
    noOfAttendees: number;

    @ManyToOne(() => User, (user) => user.reservedServices)
    user: User;

    @ManyToOne(() => Service, (service)=> service.reservations, {
        onDelete: "CASCADE"
    })
    service: Service;
}