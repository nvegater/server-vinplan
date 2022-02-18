import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Winery } from "./Winery";
import { registerEnumType } from "type-graphql";

export enum ProductionType {
  "COMERCIAL" = "Comercial",
  "TRAD_ARTESANAL" = "Tradicional - Artesanal",
  "ORG_BIO_NAT" = "Orgánico / Biodinámica / Naturales",
}

registerEnumType(ProductionType, {
  name: "ProductionType",
  description: "Types of wine production",
});

@Entity()
export class WineProductionType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  wineryId: number;

  @Column("enum", { name: "productionType", enum: ProductionType })
  productionType: ProductionType;

  @ManyToOne(() => Winery, (winery) => winery.productionType)
  winery: Winery;
}
