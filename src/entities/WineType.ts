import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Winery} from "./Winery";
import {registerEnumType} from "type-graphql";

export enum TypeWine {
    "BLANCO"="Blanco",
    "ROSADO"="Rosado",
    "TINTO_JOVEN"="Tinto joven",
    "TINTO_CRIANZA_BARRICA"="Tinto crianza (con barrica)",
    "GENEROSO_FORTIFICADO"="Generoso / fortificado",
    "ESPUMOSO"="Espumoso",
    "NARANJA"="Naranja",
    "DULCE"="Dulce",
    "COSECHA"="Cosecha Tardía",
    "CONMEMORATIVO_EDI_LIMITADA"="Vinos conmemorativos o edición limitada",
    "EXCLUSIVO_VENTA_LOCAL"="Vino exclusivo de venta en el lugar",
    "ORGANICO"="Orgánico",
    "BIODINAMICO"="Biodinámico",
    "NATURAL"="Natural",
}

registerEnumType(TypeWine, {
    name: "TypeWine",
    description: "Types of wine produced by a winery"
});

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