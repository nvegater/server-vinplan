import {MigrationInterface, QueryRunner} from "typeorm";

export class MakePriceInSlotNonNullable1642021980045 implements MigrationInterface {
    name = 'MakePriceInSlotNonNullable1642021980045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_slot" ALTER COLUMN "pricePerPersonInDollars" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_slot" ALTER COLUMN "pricePerPersonInDollars" DROP NOT NULL`);
    }

}
