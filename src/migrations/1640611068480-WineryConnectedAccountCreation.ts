import {MigrationInterface, QueryRunner} from "typeorm";

export class WineryConnectedAccountCreation1640611068480 implements MigrationInterface {
    name = 'WineryConnectedAccountCreation1640611068480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" ADD "accountCreatedTime" integer NOT NULL DEFAULT '-1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "accountCreatedTime"`);
    }

}
