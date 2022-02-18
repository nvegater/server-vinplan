import {MigrationInterface, QueryRunner} from "typeorm";

export class AddWineryAliasToImageEntity1642514467372 implements MigrationInterface {
    name = 'AddWineryAliasToImageEntity1642514467372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery_image" ADD "wineryAlias" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery_image" DROP COLUMN "wineryAlias"`);
    }

}
