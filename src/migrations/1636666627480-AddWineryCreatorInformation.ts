import {MigrationInterface, QueryRunner} from "typeorm";

export class AddWineryCreatorInformation1636666627480 implements MigrationInterface {
    name = 'AddWineryCreatorInformation1636666627480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" DROP CONSTRAINT "UQ_1c7028313cddf1247acbdc0adf0"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "winery" ADD "creatorUsername" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "winery" ADD CONSTRAINT "UQ_df9194396c0dd5a365657fcb648" UNIQUE ("creatorUsername")`);
        await queryRunner.query(`ALTER TABLE "winery" ADD "creatorEmail" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "winery" ADD CONSTRAINT "UQ_22263b9e94e5887e2c2368494d5" UNIQUE ("creatorEmail")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" DROP CONSTRAINT "UQ_22263b9e94e5887e2c2368494d5"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "creatorEmail"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP CONSTRAINT "UQ_df9194396c0dd5a365657fcb648"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "creatorUsername"`);
        await queryRunner.query(`ALTER TABLE "winery" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "winery" ADD CONSTRAINT "UQ_1c7028313cddf1247acbdc0adf0" UNIQUE ("userId")`);
    }

}
