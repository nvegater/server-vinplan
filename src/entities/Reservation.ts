import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, Float, Int, ObjectType } from "type-graphql";
import { Experience } from "./Experience";
import { Length } from "class-validator";

// Users can only reserve slots
@ObjectType()
@Entity()
export class Reservation extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Length(63)
  @Column({ length: 63 })
  title!: string;

  @Field(() => String)
  @Column({ unique: true })
  userId!: string;

  @Field(() => Date)
  @Column({ type: "timestamptz" })
  startDateTime!: Date;

  @Field(() => Date)
  @Column({ type: "timestamptz" })
  endDateTime!: Date;

  // Null when is irregular recurrent
  @Field(() => Int)
  @Column({ type: "int" })
  noOfAttendees!: number;

  @Field(() => Float)
  @Column({ type: "float" })
  pricePerPersonInDollars!: number;

  @Field()
  @Column()
  orderId: string;

  @Field()
  @Column()
  paymentCreationDateTime: string;

  @Field()
  @Column()
  paymentUpdateDateTime: string;

  @Field()
  @Column()
  status: string;

  @Field(() => Int)
  @Column()
  experienceId!: number;

  @Field(() => Experience)
  @ManyToOne(() => Experience, (exp) => exp.reservations)
  experience!: Experience;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
