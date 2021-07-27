import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Winery} from "./Winery";
import {registerEnumType} from "type-graphql";

export enum Grape {
    "AGLIANICO" = "Aglianico",
    "BARBERA" = "Barbera",
    "BRUNELLO" = "Brunello",
    "CABERNET_FRANC" = "Cabernet Franc",
    "CABERNET_SAUVIGNON" = "Cabernet Sauvignon",
    "CARIGNAN" = "Carignan",
    "CHARDONNAY" = "Chardonnay",
    "CHENIN_BLANC" = "Chenin Blanc",
    "CINSAUL" = "Cinsaul",
    "COLOMBARD" = "Colombard",
    "GEWURZTRAMINER" = "Gewurztraminer",
    "GRENACHE" = "Grenache",
    "GRENACHE_BLANC" = "Grenache Blanc",
    "MALBEC" = "Malbec",
    "MALVASIA_BLANCA" = "Malvasia Blanca",
    "MALVASIA_TINTA" = "Malvasia Tinta",
    "MERLOT" = "Merlot",
    "MISION" = "Mision",
    "MONTEPULCIANO" = "Montepulciano",
    "MOSCATEL" = "Moscatel",
    "MOURVEDRE" = "Mourvedre",
    "NEBBIOLO" = "Nebbiolo",
    "PALOMINO" = "Palomino",
    "PETITE_VERDOT" = "Petite Verdot",
    "PINOT_BLANC" = "Pinot Blanc",
    "PINOT_GRIS" = "Pinot Gris",
    "PINOT_NOIR" = "Pinot Noir",
    "RIESLING" = "Riesling",
    "RUBI_CABERNET" = "Rubi Cabernet",
    "SANGIOVESE" = "Sangiovese",
    "SAUVIGNON_BLANC" = "Sauvignon Blanc",
    "SEMILLON" = "Semillon",
    "SINSAULT" = "Sinsault",
    "SYRAH" = "Syrah",
    "TEMPRANILLO" = "Tempranillo",
    "VIOGNIER" = "Viognier",
    "ZINFANDEL" = "Zinfandel",
    "OTRA" = "Otra"
}

registerEnumType(Grape, {
    name: "Grape",
    description: "A winery can have one o more kind of grape"
});

@Entity()
export class WineGrapesProduction extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    wineryId: number;

    @Column('enum', {name: 'wineGrapesProduction', enum: Grape})
    wineGrapesProduction: Grape;

    @ManyToOne(() => Winery, (winery) => winery.wineGrapesProduction)
    winery: Winery;

}