import {MigrationInterface, QueryRunner} from "typeorm";

export class EventData1609768943539 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        insert into wine_event (
                                "wineryId", 
                                "pricePerPersonInDollars",
                                duration,
                                "title",
                                description, 
                                "startDate",
                                "startTime",
                                "endTime"
                                ) 
        VALUES (
                1,
                0, 
                120,
                'Recorrido: Santos Brujos en Viñas del sol',
                'Recorrido en la bodega con degustación de vinos Santos Brujos',
                '2021-03-01',
                '2021-03-01 16:00:00',
                '2021-03-01 18:00:00'
                );

        insert into wine_event (
            "wineryId",
            "pricePerPersonInDollars",
            duration,
            "title",
            description,
            "startDate",
            "startTime",
            "endTime"
        )
        VALUES (
                   2,
                   120,
                   30,
                   'Degustación Básica en Vinisterra Vinicolas',
                   'Degustación básica $120.00 (2 vinos) duración 30mins ',
                   '2021-03-01',
                   '2021-03-02 15:00:00',
                   '2021-03-02 15:30:00'
               );

    insert into wine_event (
            "wineryId",
            "pricePerPersonInDollars",
            duration,
            "title",
            description,
            "startDate",
            "startTime",
            "endTime"
        )
        VALUES (
                   3,
                   250,
                   60,
                   'Degustación en Montaño Benson',
                   'Degustación de 5 vinos $250 (duración 1 hora)',
                   '2021-03-02',
                   '2021-03-02 15:00:00',
                   '2021-03-02 15:30:00'
               );

insert into wine_event (
            "wineryId",
            "pricePerPersonInDollars",
            duration,
            "title",
            description,
            "startDate",
            "startTime",
            "endTime"
        )
        VALUES (
                   3,
                   250,
                   60,
                   'Comida en Montaño Benson',
                   'Comida de Temporada $550 (sujeto a disponibilidad)',
                   '2021-03-03',
                   '2021-03-03 15:00:00',
                   '2021-03-03 15:30:00'
               );
        `)
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
    }

}
