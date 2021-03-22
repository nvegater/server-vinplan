import {MigrationInterface, QueryRunner} from "typeorm";

export class CorrectedParentId1616397018733 implements MigrationInterface {
    name = 'CorrectedParentId1616397018733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE service ADD COLUMN "parentServiceId" INTEGER DEFAULT NULL`);
    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
