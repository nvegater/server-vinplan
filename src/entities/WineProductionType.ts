import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Winery} from "./Winery";

export enum ProductionType {
"COMERCIAL",
"TRAD_ARTESANAL",
"ORG_BIO_NAT"
}

@Entity()
export class WineProductionType extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    wineryId: number;

    @Column('enum', { name: 'productionType', enum: ProductionType})
    productionType: ProductionType;

    @ManyToOne(() => Winery, (winery) => winery.productionType)
    winery: Winery;

}