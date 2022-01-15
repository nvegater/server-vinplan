import {MigrationInterface, QueryRunner} from "typeorm";

export class AddWineryNameToReservation1642289376818 implements MigrationInterface {
    name = 'AddWineryNameToReservation1642289376818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" ADD "wineryName" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "wineryName"`);
    }

}
