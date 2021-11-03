import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Winery } from "./Winery";
import { registerEnumType } from "type-graphql";

export enum SupportedLanguage {
  "INGLES" = "Inglés",
  "ESPANOL" = "Español",
  "SENAS_MEXICANAS" = "Lenguage de señas mexicanas",
  "FRANCES" = "Francés",
  "ALEMAN" = "Alemán",
  "ITALIANO" = "Italiano",
  "PORTUGUES" = "Portugués",
  "JAPONES" = "Japones",
  "MANDARIN" = "Mandarín",
}

registerEnumType(SupportedLanguage, {
  name: "ServiceLanguage",
  description: "Languages supported by the Wineries",
});

@Entity()
export class WineryLanguage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  wineryId: number;

  @Column("enum", { name: "supportedLanguage", enum: SupportedLanguage })
  supportedLanguage: SupportedLanguage;

  @ManyToOne(() => Winery, (winery) => winery.productionType)
  winery: Winery;
}
