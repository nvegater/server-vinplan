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
import { Length } from "class-validator";
import { ExperienceSlot } from "./ExperienceSlot";

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
  @Column({ type: "text" })
  email!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  username: string | null;

  // Null when is irregular recurrent
  @Field(() => Int)
  @Column({ type: "int" })
  noOfAttendees!: number;

  @Field(() => Float)
  @Column({ type: "float" })
  pricePerPersonInDollars!: number;

  @Field()
  @Column()
  paymentStatus: "no_payment_required" | "paid" | "unpaid";

  @Field(() => Int)
  @Column()
  slotId: number;

  @Field(() => ExperienceSlot)
  @ManyToOne(() => ExperienceSlot, (slot) => slot.reservations)
  slot: ExperienceSlot;

  @Field(() => Date)
  @Column({ type: "timestamptz" })
  startDateTime!: Date;

  @Field(() => Date)
  @Column({ type: "timestamptz" })
  endDateTime!: Date;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
