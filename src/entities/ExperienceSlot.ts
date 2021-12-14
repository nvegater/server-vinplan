import { Field, Int, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Experience } from "./Experience";

export enum SlotType {
  ONE_TIME,
  RECURRENT,
  ALL_DAY,
}

registerEnumType(SlotType, {
  name: "SlotType",
  description: "Type of slot",
});

@ObjectType()
@Entity()
export class ExperienceSlot extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Date)
  @Column({ type: "timestamptz" })
  startDateTime!: Date;

  @Field(() => Date)
  @Column({ type: "timestamptz" })
  endDateTime!: Date; // For Recurrent Experience End Date Time Refers to the whole recursion.
  // If an irregular slot is created, it could potentially replace endDate time

  @Field(() => SlotType)
  @Column("enum", { name: "slotType", enum: SlotType })
  slotType!: SlotType;

  @Field(() => Int)
  @Column({ type: "int" })
  durationInMinutes!: number;

  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: "int", default: 0 })
  noOfAttendees: number;

  @Field(() => Int)
  @Column({ type: "int" })
  limitOfAttendees!: number;

  //---References to other entities

  @Field()
  @Column()
  experienceId!: number;

  @Field(() => Experience)
  @ManyToOne(() => Experience, (exp) => exp.slots)
  experience!: Experience;

  //---Meta

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
