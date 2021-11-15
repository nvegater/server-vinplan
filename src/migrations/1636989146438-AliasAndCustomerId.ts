import {MigrationInterface, QueryRunner} from "typeorm";

export class AliasAndCustomerId1636989146438 implements MigrationInterface {
    name = 'AliasAndCustomerId1636989146438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" ADD "urlAlias" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "winery" ADD CONSTRAINT "UQ_ad64399256d30eb9a6fd5196a33" UNIQUE ("urlAlias")`);
        await queryRunner.query(`ALTER TABLE "winery" ADD "stripe_customerId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "stripe_customerId"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP CONSTRAINT "UQ_ad64399256d30eb9a6fd5196a33"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "urlAlias"`);
    }

}
