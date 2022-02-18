import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Winery } from "./Winery";
import { registerEnumType } from "type-graphql";

export enum Amenity {
  "TERRAZA" = "Terraza al aire libre",
  "DEGUSTACION" = "Degustación de vinos",
  "RECORRIDO_VINEDOS" = "Recorridos en viñedos",
  "RECORRIDO_BODEGA" = "Recorridos en bodega",
  "PASEO_CARRETA" = "Paseo en carreta",
  "VISITA_CAVA_BARRICAS" = "Visita la cava de barricas",
  "CATA_BARRICAS" = "Cata de barricas",
  "CREA_TU_MEZCLA" = "Crea tu mezcla de vino",
  "TALLERES_DIDACTICOS" = "Talleres didácticos",
  "CATAS_MARIDAJES" = "Catas maridajes",
  "CATAS_PRIVADAS" = "Catas privadas",
  "ACTIVIDADES_EN_VINEDO" = "Actividades en viñedo",
}

registerEnumType(Amenity, {
  name: "Amenity",
  description: "Types of wine production",
});

@Entity()
export class WineryAmenity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  wineryId: number;

  @Column("enum", { name: "amenity", enum: Amenity })
  amenity: Amenity;

  @ManyToOne(() => Winery, (winery) => winery.productionType)
  winery: Winery;
}
