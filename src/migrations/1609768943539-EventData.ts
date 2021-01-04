import {MigrationInterface, QueryRunner} from "typeorm";

export class EventData1609768943539 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        insert into wine_event ("wineryId", 
                                description, 
                                duration, 
                                "pricePerPersonInDollars") 
        VALUES (1,'Recorrido en la bodega con degustación de vinos Santos Brujos', 120,0);

        insert into wine_event ("wineryId",
                                description,
                                duration,
                                "pricePerPersonInDollars")
        VALUES (2,'Degustación básica $120.00 (2 vinos) duración 30mins ', 30,120);

        insert into wine_event ("wineryId",
                                description,
                                duration,
                                "pricePerPersonInDollars")
        VALUES (3,'Degustación de 5 vinos $250 (duración 1 hora)', 60,250);
        insert into wine_event ("wineryId",
                                description,
                                duration,
                                "pricePerPersonInDollars")
        VALUES (3,'Comida de Temporada $550 (sujeto a disponibilidad)', 120,550);
        `)
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
    }

}
