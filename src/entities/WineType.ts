import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Winery} from "./Winery";

export enum TypeWine {
    "BLANCO",
    "ROSADO",
    "TINTO_JOVEN",
    "TINTO_CRIANZA_BARRICA",
    "GENEROSO_FORTIFICADO",
    "ESPUMOSO",
    "NARANJA",
    "DULCE",
    "COSECHA",
    "CONMEMORATIVO_EDI_LIMITADA",
    "EXCLUSIVO_VENTA_LOCAL",
    "ORGANICO",
    "BIODINAMICO",
    "NATURAL",
}

@Entity()
export class WineType extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    wineryId: number;

    @Column('enum', {name: 'wineType', enum: TypeWine})
    wineType: TypeWine;

    @ManyToOne(() => Winery, (winery) => winery.productionType)
    winery!: Winery;

}