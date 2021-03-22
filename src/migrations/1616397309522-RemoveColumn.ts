import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveColumn1616397309522 implements MigrationInterface {
    name = 'RemoveColumn1616397309522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE service DROP COLUMN parentserviceid CASCADE;`);
    }

    public async down(_: QueryRunner): Promise<void> {

    }

}
