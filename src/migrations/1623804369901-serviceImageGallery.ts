import { MigrationInterface, QueryRunner } from "typeorm";

export class serviceImageGallery1623804369901 implements MigrationInterface {
  name = "serviceImageGallery1623804369901";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "service_image_gallery" ("id" SERIAL NOT NULL, "serviceId" integer, "imageUrl" character varying, "coverPage" boolean NOT NULL DEFAULT 'false', CONSTRAINT "PK_bdd6504d4c655b71f27276e8513" PRIMARY KEY ("id"))`
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
    await queryRunner.query(`DROP TABLE "service_image_gallery"`);
  }
}
