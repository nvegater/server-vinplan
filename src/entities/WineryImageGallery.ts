import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field} from "type-graphql";
import {Winery} from "./Winery";

@Entity()
export class WineryImageGallery extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Field({nullable: true})
    @Column()
    wineryId: number;

    @Field({nullable: true})
    @Column({nullable: true})
    imageUrl: string;

    @ManyToOne(() => Winery, (winery) => winery.productionType)
    winery: Winery;

}