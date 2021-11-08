import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { Experience } from "./Experience";
@ObjectType()
@Entity()
export class Picture extends BaseEntity {
  @Field({ nullable: true })
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column()
  experienceId!: number;

  @Field(() => Experience)
  @ManyToOne(() => Experience, (exp) => exp.pictures)
  experience!: Experience;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl: string;

  @Field()
  @Column("boolean", {
    default: false,
  })
  coverPage: boolean = false;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
