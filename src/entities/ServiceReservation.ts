import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Service } from "./Service";
import { Field, Float, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class ServiceReservation extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  userId: number;

  @Field(() => Int)
  @PrimaryColumn()
  serviceId: number;

  @Column({ nullable: true })
  serviceCreatorId: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  noOfAttendees: number;

  @Field()
  @Column()
  paypalOrderId: string;

  @Field()
  @Column()
  status: string;

  @Field()
  @Column()
  paymentCreationDateTime: string;

  @Field(() => Float)
  @Column({ type: "float", nullable: true })
  pricePerPersonInDollars: number;

  @Field(() => User)
  userInfo: User;

  @Field(() => Service)
  experienceInfo: Service;

  @ManyToOne(() => User, (user) => user.reservedServices)
  user: User;

  @ManyToOne(() => Service, (service) => service.reservations, {
    onDelete: "CASCADE",
  })
  service: Service;
}
