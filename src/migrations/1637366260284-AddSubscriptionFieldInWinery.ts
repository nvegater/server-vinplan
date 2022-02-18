import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSubscriptionFieldInWinery1637366260284 implements MigrationInterface {
    name = 'AddSubscriptionFieldInWinery1637366260284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" ADD "subscription" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" DROP COLUMN "subscription"`);
    }

}
