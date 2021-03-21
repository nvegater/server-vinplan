import {MigrationInterface, QueryRunner} from "typeorm";

export class AddParentId1616363728391 implements MigrationInterface {
    name = 'AddParentId1616363728391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE service ADD COLUMN parentServiceId INTEGER;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
    }

}
