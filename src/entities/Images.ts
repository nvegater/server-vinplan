import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Experience } from "./Experience";
import { Winery } from "./Winery";
@ObjectType()
@Entity()
export class UserImage extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  creatorUsername!: string;

  @Field()
  @Column()
  imageUrl!: string;

  @Field({ defaultValue: true })
  @Column({ default: true })
  coverPage: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}

@ObjectType()
@Entity()
export class WineryImage extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  wineryId!: number;

  @Field(() => Winery)
  @ManyToOne(() => Winery, (winery) => winery.images)
  winery!: Winery;

  @Field()
  @Column()
  imageUrl!: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  coverPage: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}

@ObjectType()
@Entity()
export class ExperienceImage extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  experienceId!: number;

  @Field(() => Experience)
  @ManyToOne(() => Experience, (exp) => exp.images)
  experience!: Experience;

  @Field()
  @Column()
  imageUrl!: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  coverPage: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
