import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";
@ObjectType()
@Entity()
export class WineryImageGallery extends BaseEntity {

    @Field({nullable: true})
    @PrimaryGeneratedColumn()
    id!: number;

    @Field({nullable: true})
    @Column({nullable: true})
    wineryId: number;

    @Field({nullable: true})
    @Column({nullable: true})
    imageUrl: string;

    @Field()
    @Column('boolean', {default: false})
    coverPage: boolean = false;

}