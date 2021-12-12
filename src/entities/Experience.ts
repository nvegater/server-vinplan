import { Field, Float, Int, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Length } from "class-validator";
import { Winery } from "./Winery";
import { Reservation } from "./Reservation";
import { ExperienceImage } from "./Images";
import { ExperienceSlot } from "./ExperienceSlot";

export enum ExperienceType {
  WINE_DINNER_PAIRING,
  DEGUSTATION,
  CONCERT,
}

registerEnumType(ExperienceType, {
  name: "ExperienceType",
  description: "Type of experience",
});

@ObjectType()
@Entity()
export class Experience extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Length(63)
  @Column({ length: 63 })
  title!: string;

  @Field(() => String)
  @Length(255)
  @Column({ length: 255 })
  description!: string;

  @Field(() => ExperienceType)
  @Column("enum", { name: "experienceType", enum: ExperienceType })
  experienceType!: ExperienceType;

  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: "int", default: 0 })
  allAttendeesAllSlots: number;

  @Field(() => Float)
  @Column({ type: "float" })
  pricePerPersonInDollars!: number;

  // -- Reference to others

  @Field(() => [ExperienceSlot])
  @OneToMany(
    () => ExperienceSlot,
    (experienceSlot) => experienceSlot.experience
  )
  slots!: ExperienceSlot[];

  @Field(() => [ExperienceImage], { nullable: true })
  @OneToMany(
    () => ExperienceImage,
    (experienceImage) => experienceImage.experience,
    {
      nullable: true,
    }
  )
  images: ExperienceImage[] | null;

  @Field(() => Int)
  @Column()
  wineryId!: number;

  @Field(() => Winery)
  @ManyToOne(() => Winery, (winery) => winery.experiences)
  winery!: Winery;

  @Field(() => [Reservation], { nullable: true })
  @OneToMany(() => Reservation, (reservation) => reservation.experience)
  reservations: Reservation[];

  // --MEta

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
