import {MigrationInterface, QueryRunner} from "typeorm";

export class AccountField1638132365025 implements MigrationInterface {
    name = 'AccountField1638132365025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" ADD "accountId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "accountId"`);
    }

}
