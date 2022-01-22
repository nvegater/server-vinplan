import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageNamesNotUnique1642883836329 implements MigrationInterface {
    name = 'ImageNamesNotUnique1642883836329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_image" DROP CONSTRAINT "UQ_9fbd9b86830637847cbcf49b179"`);
        await queryRunner.query(`ALTER TABLE "winery_image" DROP CONSTRAINT "UQ_96714b25950e30ba7c4c184b145"`);
        await queryRunner.query(`ALTER TABLE "experience_image" DROP CONSTRAINT "UQ_305c9854cd87e9c16404937698b"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_image" ADD CONSTRAINT "UQ_305c9854cd87e9c16404937698b" UNIQUE ("imageName")`);
        await queryRunner.query(`ALTER TABLE "winery_image" ADD CONSTRAINT "UQ_96714b25950e30ba7c4c184b145" UNIQUE ("imageName")`);
        await queryRunner.query(`ALTER TABLE "user_image" ADD CONSTRAINT "UQ_9fbd9b86830637847cbcf49b179" UNIQUE ("imageName")`);
    }

}
