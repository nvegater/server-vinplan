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
    }

}
