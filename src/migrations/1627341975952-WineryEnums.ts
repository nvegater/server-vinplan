import {MigrationInterface, QueryRunner} from "typeorm";

export class WineryEnums1627341975952 implements MigrationInterface {
    name = 'WineryEnums1627341975952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" ADD "logo" character varying`);
        await queryRunner.query(`ALTER TABLE "winery" ADD "contactName" character varying`);
        await queryRunner.query(`ALTER TABLE "winery" ADD "productRegion" character varying`);
        await queryRunner.query(`ALTER TABLE "winery" ADD "postalCode" character varying`);
        await queryRunner.query(`ALTER TABLE "winery" ADD "architecturalReferences" boolean`);
        await queryRunner.query(`ALTER TABLE "winery" ADD "younerFriendly" boolean`);
        await queryRunner.query(`ALTER TABLE "winery" ADD "petFriendly" boolean`);
        await queryRunner.query(`ALTER TABLE "winery" ADD "enologoName" boolean`);
        await queryRunner.query(`ALTER TABLE "winery" ADD "handicappedFriendly" boolean`);
        await queryRunner.query(`ALTER TABLE "service_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "noOfAttendees" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TYPE "wine_type_winetype_enum" RENAME TO "wine_type_winetype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "wine_type_winetype_enum" AS ENUM('Blanco joven', 'Blanco con barrica', 'Rosado', 'Tinto sin barrica', 'Tinto con barrica', 'Generoso / fortificado', 'Espumoso', 'Naranja', 'Dulce', 'Cosecha Tardía', 'Conmemorativos o edición limitada', 'Exclusivos de venta en el lugar', 'Orgánico', 'Biodinámico', 'Natural')`);
        await queryRunner.query(`ALTER TABLE "wine_type" ALTER COLUMN "wineType" TYPE "wine_type_winetype_enum" USING "wineType"::"text"::"wine_type_winetype_enum"`);
        await queryRunner.query(`DROP TYPE "wine_type_winetype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "winery" RENAME COLUMN "postalCode" TO "postalAddress"`);
        await queryRunner.query(`CREATE TYPE "wine_grapes_production_winegrapesproduction_enum" AS ENUM('Aglianico', 'Barbera', 'Brunello', 'Cabernet Franc', 'Cabernet Sauvignon', 'Carignan', 'Chardonnay', 'Chenin Blanc', 'Cinsaul', 'Colombard', 'Gewurztraminer', 'Grenache', 'Grenache Blanc', 'Malbec', 'Malvasia Blanca', 'Malvasia Tinta', 'Merlot', 'Mision', 'Montepulciano', 'Moscatel', 'Mourvedre', 'Nebbiolo', 'Palomino', 'Petite Verdot', 'Pinot Blanc', 'Pinot Gris', 'Pinot Noir', 'Riesling', 'Rubi Cabernet', 'Sangiovese', 'Sauvignon Blanc', 'Semillon', 'Sinsault', 'Syrah', 'Tempranillo', 'Viognier', 'Zinfandel', 'Otra')`);
        await queryRunner.query(`CREATE TABLE "wine_grapes_production" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "wineGrapesProduction" "wine_grapes_production_winegrapesproduction_enum" NOT NULL, CONSTRAINT "PK_15a41ca39f1a56ae12789ac4413" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "service_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "noOfAttendees" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "wine_grapes_production" ADD CONSTRAINT "FK_d5efed0d81dd5a9b001ac7e54f0" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TYPE "winery_other_services_grape_enum" AS ENUM('Hospedaje', 'Restaurante', 'Barra de Alimentos (Tapas)')`);
        await queryRunner.query(`CREATE TABLE "winery_other_services" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "Grape" "winery_other_services_grape_enum" NOT NULL, CONSTRAINT "PK_6fa8c02a5ca52b6c7ef3b0d3a16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "winery_other_services" ADD CONSTRAINT "FK_6cc398dd7b2383db976495eb6bc" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "wine_type_winetype_enum_old" AS ENUM('Blanco', 'Rosado', 'Tinto joven', 'Tinto crianza (con barrica)', 'Generoso / fortificado', 'Espumoso', 'Naranja', 'Dulce', 'Cosecha Tardía', 'Vinos conmemorativos o edición limitada', 'Vino exclusivo de venta en el lugar', 'Orgánico', 'Biodinámico', 'Natural')`);
        await queryRunner.query(`ALTER TABLE "wine_type" ALTER COLUMN "wineType" TYPE "wine_type_winetype_enum_old" USING "wineType"::"text"::"wine_type_winetype_enum_old"`);
        await queryRunner.query(`DROP TYPE "wine_type_winetype_enum"`);
        await queryRunner.query(`ALTER TYPE "wine_type_winetype_enum_old" RENAME TO "wine_type_winetype_enum"`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "noOfAttendees" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "startDateTime"`);
        await queryRunner.query(`ALTER TABLE "service" ADD "startDateTime" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "service_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "handicappedFriendly"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "enologoName"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "petFriendly"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "younerFriendly"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "architecturalReferences"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "postalCode"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "productRegion"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "contactName"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "logo"`);
        await queryRunner.query(`ALTER TABLE "wine_grapes_production" DROP CONSTRAINT "FK_d5efed0d81dd5a9b001ac7e54f0"`);
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "noOfAttendees" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "service_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT false`);
        await queryRunner.query(`DROP TABLE "wine_grapes_production"`);
        await queryRunner.query(`DROP TYPE "wine_grapes_production_winegrapesproduction_enum"`);
        await queryRunner.query(`ALTER TABLE "winery" RENAME COLUMN "postalAddress" TO "postalCode"`);
        await queryRunner.query(`ALTER TABLE "winery_other_services" DROP CONSTRAINT "FK_6cc398dd7b2383db976495eb6bc"`);
        await queryRunner.query(`DROP TABLE "winery_other_services"`);
        await queryRunner.query(`DROP TYPE "winery_other_services_grape_enum"`);
    }

}
