import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

// If customer has metadata, it means it is a registered user and It has an username
// But Customers dont need to be registered. They can book events as guests
@ObjectType({
  description:
    "If customer has metadata, it means it is a registered user and It has an username." +
    "But Customers dont need to be registered. They can book events as guests, thats why the metadata prop is nullable",
})
@Entity()
export class Customer extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  stripeCustomerId: string;

  @Field()
  @Column()
  email: string;

  @Field(() => String, {
    nullable: true,
    description: "Can be null when a non-registered user buys something",
  })
  @Column({ nullable: true })
  username: string | null;

  // --MEta

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
