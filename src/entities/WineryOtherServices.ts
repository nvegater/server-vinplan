import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Winery} from "./Winery";
import {registerEnumType} from "type-graphql";

export enum OtherServices {
    "HOSPEDAJE" = "Hospedaje",
    "RESTAURANTE" = "Restaurante",
    "BARRA_DE_ALIMENTOS" = "Barra de Alimentos (Tapas)",
}

registerEnumType(OtherServices, {
    name: "OtherServices",
    description: "differents kind of services"
});

@Entity()
export class WineryOtherServices extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    wineryId: number;

    @Column('enum', {name: 'Grape', enum: OtherServices})
    wineGrapesProduction: OtherServices;

    @ManyToOne(() => Winery, (winery) => winery.wineGrapesProduction)
    winery: Winery;

}