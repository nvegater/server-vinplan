import {MigrationInterface, QueryRunner} from "typeorm";

export class EventData1609768943539 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        insert into service (
                                "wineryId", 
                                "pricePerPersonInDollars",
                                duration,
                                "title",
                                description, 
                                "startDate",
                                "eventType", "creatorId"
        ) 
        VALUES (
                100,
                0, 
                120,
                'Recorrido: Santos Brujos en Viñas del sol',
                'Recorrido en la bodega con degustación de vinos Santos Brujos',
                '2021-03-01 00:00:00',
                'Degustación', 1
                );

        insert into service (
            "wineryId",
            "pricePerPersonInDollars",
            duration,
            "title",
            description,
            "startDate",
            "eventType", "creatorId"
        )
        VALUES (
                   200,
                   120,
                   30,
                   'Degustación Básica en Vinisterra Vinicolas',
                   'Degustación básica $120.00 (2 vinos) duración 30mins ',
                   '2021-03-01 00:00:00',
                   'Degustación', 1
               );

    insert into service (
            "wineryId",
            "pricePerPersonInDollars",
            duration,
            "title",
            description,
            "startDate",
            "eventType", "creatorId"
        )
        VALUES (
                   300,
                   250,
                   60,
                   'Degustación en Montaño Benson',
                   'Degustación de 5 vinos $250 (duración 1 hora)',
                   '2021-03-02 00:00:00',
                   'Degustación', 1
               );

insert into service (
            "wineryId",
            "pricePerPersonInDollars",
            duration,
            "title",
            description,
            "startDate",
            "eventType", "creatorId"
)
        VALUES (
                   300,
                   250,
                   60,
                   'Comida en Montaño Benson',
                   'Comida de Temporada $550 (sujeto a disponibilidad)',
                   '2021-03-03 00:00:00',
                   'Comida/Cena Maridaje', 1
               );
        `)
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
    }

}
