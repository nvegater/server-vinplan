import {Field, Int, ObjectType, registerEnumType} from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Service} from "./Service";
import {Frequency} from "rrule"
registerEnumType(Frequency, {
    name: "Frequency",
    description: "yearly, monthly, weekly, dairly, hourly, minutely secondly"
});

@ObjectType()
@Entity()
export class FrequencyRule extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;
    // Multiple services can reference the same rule
    // The same frequency rule can apply for multiple services
    @Field(() => Frequency)
    @Column('enum', { name: 'frequency', enum: Frequency})
    frequency: Frequency;

    @OneToMany(() => Service, service => service.frequencyRule)
    services: Service[];

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date;

}