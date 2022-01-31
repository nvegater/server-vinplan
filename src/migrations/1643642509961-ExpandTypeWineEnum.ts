import {MigrationInterface, QueryRunner} from "typeorm";

export class ExpandTypeWineEnum1643642509961 implements MigrationInterface {
    name = 'ExpandTypeWineEnum1643642509961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."wine_type_winetype_enum" RENAME TO "wine_type_winetype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."wine_type_winetype_enum" AS ENUM('Blanco', 'Blanco con barrica', 'Rosado', 'Tinto crianza', 'Tinto reserva', 'Tinto gran Reserva', 'Generoso / Fortificado', 'Espumoso', 'Cosecha Tardía', 'Naranja', 'Dulce', 'Natural', 'Conmemorativos / Edición limitada', 'Exclusivos de venta en el lugar', 'Orgánico', 'Biodinámico', 'Otro')`);
        await queryRunner.query(`ALTER TABLE "wine_type" ALTER COLUMN "wineType" TYPE "public"."wine_type_winetype_enum" USING "wineType"::"text"::"public"."wine_type_winetype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."wine_type_winetype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."wine_type_winetype_enum_old" AS ENUM('Blanco joven', 'Blanco con barrica', 'Rosado', 'Tinto joven', 'Tinto con barrica', 'Generoso / fortificado', 'Espumoso', 'Naranja', 'Dulce', 'Cosecha Tardía', 'Conmemorativos o edición limitada', 'Exclusivos de venta en el lugar', 'Orgánico', 'Biodinámico', 'Natural')`);
        await queryRunner.query(`ALTER TABLE "wine_type" ALTER COLUMN "wineType" TYPE "public"."wine_type_winetype_enum_old" USING "wineType"::"text"::"public"."wine_type_winetype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."wine_type_winetype_enum_old" RENAME TO "wine_type_winetype_enum"`);
    }

}
