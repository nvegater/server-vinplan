import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameImageUrlKey1642862801623 implements MigrationInterface {
    name = 'RenameImageUrlKey1642862801623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_image" RENAME COLUMN "imageUrl" TO "imageKey"`);
        await queryRunner.query(`ALTER TABLE "winery_image" RENAME COLUMN "imageUrl" TO "imageKey"`);
        await queryRunner.query(`ALTER TABLE "experience_image" RENAME COLUMN "imageUrl" TO "imageKey"`);
        await queryRunner.query(`ALTER TABLE "user_image" DROP COLUMN "imageKey"`);
        await queryRunner.query(`ALTER TABLE "user_image" ADD "imageKey" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience_image" DROP COLUMN "imageKey"`);
        await queryRunner.query(`ALTER TABLE "experience_image" ADD "imageKey" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_image" DROP COLUMN "imageKey"`);
        await queryRunner.query(`ALTER TABLE "experience_image" ADD "imageKey" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_image" DROP COLUMN "imageKey"`);
        await queryRunner.query(`ALTER TABLE "user_image" ADD "imageKey" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience_image" RENAME COLUMN "imageKey" TO "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "winery_image" RENAME COLUMN "imageKey" TO "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "user_image" RENAME COLUMN "imageKey" TO "imageUrl"`);
    }

}
