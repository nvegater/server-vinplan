import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameImageNameColumn1642868373940 implements MigrationInterface {
    name = 'RenameImageNameColumn1642868373940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_image" RENAME COLUMN "imageKey" TO "imageName"`);
        await queryRunner.query(`ALTER TABLE "winery_image" RENAME COLUMN "imageKey" TO "imageName"`);
        await queryRunner.query(`ALTER TABLE "experience_image" RENAME COLUMN "imageKey" TO "imageName"`);
        await queryRunner.query(`ALTER TABLE "user_image" ADD CONSTRAINT "UQ_9fbd9b86830637847cbcf49b179" UNIQUE ("imageName")`);
        await queryRunner.query(`ALTER TABLE "winery_image" DROP COLUMN "imageName"`);
        await queryRunner.query(`ALTER TABLE "winery_image" ADD "imageName" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "winery_image" ADD CONSTRAINT "UQ_96714b25950e30ba7c4c184b145" UNIQUE ("imageName")`);
        await queryRunner.query(`ALTER TABLE "experience_image" ADD CONSTRAINT "UQ_305c9854cd87e9c16404937698b" UNIQUE ("imageName")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_image" DROP CONSTRAINT "UQ_305c9854cd87e9c16404937698b"`);
        await queryRunner.query(`ALTER TABLE "winery_image" DROP CONSTRAINT "UQ_96714b25950e30ba7c4c184b145"`);
        await queryRunner.query(`ALTER TABLE "winery_image" DROP COLUMN "imageName"`);
        await queryRunner.query(`ALTER TABLE "winery_image" ADD "imageName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_image" DROP CONSTRAINT "UQ_9fbd9b86830637847cbcf49b179"`);
        await queryRunner.query(`ALTER TABLE "experience_image" RENAME COLUMN "imageName" TO "imageKey"`);
        await queryRunner.query(`ALTER TABLE "winery_image" RENAME COLUMN "imageName" TO "imageKey"`);
        await queryRunner.query(`ALTER TABLE "user_image" RENAME COLUMN "imageName" TO "imageKey"`);
    }

}
