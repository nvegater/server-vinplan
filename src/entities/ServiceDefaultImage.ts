import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { EventType } from "./Service";

@ObjectType()
@Entity()
export class ServiceDefaultImage extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String, { nullable: true })
  @Column()
  defaultImageUrl?: string;

  @Field(() => EventType)
  @Column("enum", { name: "eventType", enum: EventType })
  eventType: EventType;
}
