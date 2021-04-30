import {MigrationInterface, QueryRunner} from "typeorm";

export class createVerifiedField1619814991634 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery" ADD COLUMN "verified" BOOL DEFAULT FALSE`);
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "verified" BOOL DEFAULT FALSE`);
    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
