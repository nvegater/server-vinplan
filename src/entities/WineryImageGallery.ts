import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {Winery} from "./Winery";
@ObjectType()
@Entity()
export class WineryImageGallery extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Field({nullable: true})
    @Column({nullable: true})
    wineryId: number;

    @Field({nullable: true})
    @Column({nullable: true})
    imageUrl: string;

    @ManyToOne(() => Winery, (winery) => winery.productionType)
    winery: Winery;

}