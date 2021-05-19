import {MigrationInterface, QueryRunner} from "typeorm";

export class addCOVIDLabel1621019408399 implements MigrationInterface {
    name = 'addCOVIDLabel1621019408399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" ADD "covidLabel" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."rRules" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "rRules" SET DEFAULT '{}'::text[]`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."noOfAttendees" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "noOfAttendees" SET DEFAULT 0`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "winery_image_gallery"."coverPage" IS NULL`);
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "winery_image_gallery"."coverPage" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "noOfAttendees" SET DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."noOfAttendees" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "rRules" SET DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."rRules" IS NULL`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "covidLabel"`);
    }

}
