import {MigrationInterface, QueryRunner} from "typeorm";

export class addPaymentFieldsToReservations1619883077176 implements MigrationInterface {
    name = 'addPaymentFieldsToReservations1619883077176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" DROP CONSTRAINT "FK_36a54f0c7d39372d59e94885e5a"`);
        await queryRunner.query(`ALTER TABLE "service_reservation" ADD "paypalOrderId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "service_reservation" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "service_reservation" ADD "paymentCreationDateTime" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "service_reservation" ADD "pricePerPersonInDollars" double precision`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."rRules" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "rRules" SET DEFAULT '{}'::text[]`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "wineryId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "winery_image_gallery"."wineryId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "winery_image_gallery"."coverPage" IS NULL`);
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "winery_image_gallery"."coverPage" IS NULL`);
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "winery_image_gallery"."wineryId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "wineryId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "rRules" SET DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."rRules" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service_reservation" DROP COLUMN "pricePerPersonInDollars"`);
        await queryRunner.query(`ALTER TABLE "service_reservation" DROP COLUMN "paymentCreationDateTime"`);
        await queryRunner.query(`ALTER TABLE "service_reservation" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "service_reservation" DROP COLUMN "paypalOrderId"`);
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ADD CONSTRAINT "FK_36a54f0c7d39372d59e94885e5a" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
