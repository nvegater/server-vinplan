import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Winery } from "./Winery";
import { registerEnumType } from "type-graphql";

export enum TypeWine {
  "BLANCO" = "Blanco",
  "BLANCO_CON_BARRICA" = "Blanco con barrica",
  "ROSADO" = "Rosado",
  "TINTO_CRIANZA" = "Tinto crianza",
  "TINTO_RESERVA" = "Tinto reserva",
  "TINTO_GRAN_RESERVA" = "Tinto gran Reserva",
  "GENEROSO_FORTIFICADO" = "Generoso / Fortificado",
  "ESPUMOSO" = "Espumoso",
  "COSECHA" = "Cosecha Tardía",
  "NARANJA" = "Naranja",
  "DULCE" = "Dulce",
  "NATURAL" = "Natural",
  "CONMEMORATIVO" = "Conmemorativos / Edición limitada",
  "EXCLUSIVO_VENTA_LOCAL" = "Exclusivos de venta en el lugar",
  "ORGANICO" = "Orgánico",
  "BIODINAMICO" = "Biodinámico",
  "OTRO" = "Otro",
}

registerEnumType(TypeWine, {
  name: "TypeWine",
  description: "Types of wine produced by a winery",
});

@Entity()
export class WineType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  wineryId: number;

  @Column("enum", { name: "wineType", enum: TypeWine })
  wineType: TypeWine;

  @ManyToOne(() => Winery, (winery) => winery.productionType)
  winery!: Winery;
}
