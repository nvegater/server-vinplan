import { MigrationInterface, QueryRunner } from "typeorm";

export class NewWineryValley1625669789187 implements MigrationInterface {
  name = "NewWineryValley1625669789187";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "service_image_gallery"."coverPage" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "service_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT 'false'`
    );
    await queryRunner.query(`COMMENT ON COLUMN "service"."rRules" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "service" ALTER COLUMN "rRules" SET DEFAULT '{}'::text[]`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "service"."noOfAttendees" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "service" ALTER COLUMN "noOfAttendees" SET DEFAULT 0`
    );
    await queryRunner.query(`COMMENT ON COLUMN "service"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
    await queryRunner.query(
      `ALTER TYPE "public"."winery_valley_enum" RENAME TO "winery_valley_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "winery_valley_enum" AS ENUM('Guadalupe', 'San Antonio de las Minas', 'Ensenada', 'Santo Tomas', 'Ojos Negros', 'La Grulla', 'San Vicente', 'San Quintín', 'Calafia')`
    );
    await queryRunner.query(
      `ALTER TABLE "winery" ALTER COLUMN "valley" TYPE "winery_valley_enum" USING "valley"::"text"::"winery_valley_enum"`
    );
    await queryRunner.query(`DROP TYPE "winery_valley_enum_old"`);
    await queryRunner.query(`COMMENT ON COLUMN "winery"."valley" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "winery_image_gallery"."coverPage" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT 'false'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT false`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "winery_image_gallery"."coverPage" IS NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "winery"."valley" IS NULL`);
    await queryRunner.query(
      `CREATE TYPE "winery_valley_enum_old" AS ENUM('Guadalupe', 'San Antonio de las Minas', 'Ensenada', 'Santo Tomas', 'Ojos Negros', 'La Grulla', 'San Vicente', 'San Quintín')`
    );
    await queryRunner.query(
      `ALTER TABLE "winery" ALTER COLUMN "valley" TYPE "winery_valley_enum_old" USING "valley"::"text"::"winery_valley_enum_old"`
    );
    await queryRunner.query(`DROP TYPE "winery_valley_enum"`);
    await queryRunner.query(
      `ALTER TYPE "winery_valley_enum_old" RENAME TO  "winery_valley_enum"`
    );
    await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "service"."createdAt" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "service" ALTER COLUMN "noOfAttendees" SET DEFAULT '0'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "service"."noOfAttendees" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "service" ALTER COLUMN "rRules" SET DEFAULT '{}'`
    );
    await queryRunner.query(`COMMENT ON COLUMN "service"."rRules" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "service_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT false`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "service_image_gallery"."coverPage" IS NULL`
    );
  }
}
