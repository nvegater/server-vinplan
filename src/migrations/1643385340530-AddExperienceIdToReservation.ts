import {MigrationInterface, QueryRunner} from "typeorm";

export class AddExperienceIdToReservation1643385340530 implements MigrationInterface {
    name = 'AddExperienceIdToReservation1643385340530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" ADD "experienceId" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "experienceId"`);
    }

}
