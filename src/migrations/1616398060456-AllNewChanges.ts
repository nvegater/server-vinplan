import {MigrationInterface, QueryRunner} from "typeorm";

export class AllNewChanges1616398060456 implements MigrationInterface {
    name = 'AllNewChanges1616398060456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "winery_amenity_amenity_enum" AS ENUM('Terraza al aire libre', 'Degustación de vinos', 'Recorridos en viñedos', 'Recorridos en bodega', 'Paseo en carreta', 'Visita la cava de barricas', 'Cata de barricas', 'Crea tu mezcla de vino', 'Talleres didácticos', 'Catas maridajes', 'Catas privadas', 'Actividades en viñedo')`);
        await queryRunner.query(`CREATE TABLE "winery_amenity" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "amenity" "winery_amenity_amenity_enum" NOT NULL, CONSTRAINT "PK_c6f18575c854eabe9962b3274c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "winery_language_supportedlanguage_enum" AS ENUM('Español', 'Lenguage de señas mexicanas', 'Francés', 'Alemán', 'Italiano', 'Portugués', 'Japones', 'Mandarín')`);
        await queryRunner.query(`CREATE TABLE "winery_language" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "supportedLanguage" "winery_language_supportedlanguage_enum" NOT NULL, CONSTRAINT "PK_26c748e5193e9c32f5e8b79335a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "winery_amenity" ADD CONSTRAINT "FK_4083c81148ae1817a81ed057613" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "winery_language" ADD CONSTRAINT "FK_8d8a037a51b67e55d22923981b7" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(_: QueryRunner): Promise<void> {

    }

}
