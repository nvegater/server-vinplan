import { MigrationInterface, QueryRunner } from "typeorm";

export class nameOfMigration1627655414833 implements MigrationInterface {
  name = "nameOfMigration1627655414833";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "wine_type_winetype_enum" RENAME TO "wine_type_winetype_enum_old"`
    );
    await queryRunner.query(`CREATE TYPE "wine_type_winetype_enum" AS ENUM(
            'Blanco joven',
            'Blanco con barrica',
            'Rosado',
            'Tinto joven',
            'Tinto con barrica',
            'Generoso / fortificado',
            'Espumoso',
            'Naranja',
            'Dulce',
            'Cosecha Tardía',
            'Conmemorativos o edición limitada',
            'Exclusivos de venta en el lugar',
            'Orgánico',
            'Biodinámico', 
            'Natural');`);
    await queryRunner.query(`ALTER TABLE "wine_type" ALTER column "wineType" 
            TYPE "wine_type_winetype_enum" 
            USING(
            CASE 
                when "wineType"::text = 'Blanco' then 'Blanco con barrica'
                when "wineType"::text = 'Tinto crianza (con barrica)'  then 'Tinto con barrica'
                when "wineType"::text = 'Vinos conmemorativos o edición limitada' then 'Conmemorativos o edición limitada'
                when "wineType"::text = 'Vino exclusivo de venta en el lugar' then 'Exclusivo de venta en el lugar'
                when "wineType"::text = 'Exclusivo de venta en el lugar' then 'Exclusivos de venta en el lugar'
            else "wineType"::text
            END)::"wine_type_winetype_enum";`);
    await queryRunner.query(`DROP TYPE "wine_type_winetype_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "wine_type_winetype_enum" RENAME TO "wine_type_winetype_enum_old"`
    );
    await queryRunner.query(`CREATE TYPE "wine_type_winetype_enum" AS ENUM(
            'Blanco',
            'Blanco joven',
            'Blanco con barrica',
            'Rosado',
            'Tinto joven',
            'Tinto crianza (con barrica)',
            'Tinto con barrica',
            'Generoso / fortificado',
            'Espumoso',
            'Naranja',
            'Dulce',
            'Cosecha Tardía', 
            'Vinos conmemorativos o edición limitada',
            'Conmemorativos o edición limitada',
            'Vino exclusivo de venta en el lugar',
            'Exclusivo de venta en el lugar',
            'Orgánico',
            'Biodinámico', 
            'Natural');`);
    await queryRunner.query(
      `ALTER TABLE "wine_type" ALTER COLUMN "wineType" TYPE "wine_type_winetype_enum" USING "wineType"::"text"::"wine_type_winetype_enum"`
    );
    await queryRunner.query(`DROP TYPE "wine_type_winetype_enum_old"`);
  }
}
