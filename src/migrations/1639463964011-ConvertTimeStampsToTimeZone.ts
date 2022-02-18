import {MigrationInterface, QueryRunner} from "typeorm";

export class ConvertTimeStampsToTimeZone1639463964011 implements MigrationInterface {
    name = 'ConvertTimeStampsToTimeZone1639463964011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "startDateTime"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "startDateTime" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "endDateTime"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "endDateTime" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience_slot" DROP COLUMN "startDateTime"`);
        await queryRunner.query(`ALTER TABLE "experience_slot" ADD "startDateTime" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience_slot" DROP COLUMN "endDateTime"`);
        await queryRunner.query(`ALTER TABLE "experience_slot" ADD "endDateTime" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_slot" DROP COLUMN "endDateTime"`);
        await queryRunner.query(`ALTER TABLE "experience_slot" ADD "endDateTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience_slot" DROP COLUMN "startDateTime"`);
        await queryRunner.query(`ALTER TABLE "experience_slot" ADD "startDateTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "endDateTime"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "endDateTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "startDateTime"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "startDateTime" TIMESTAMP NOT NULL`);
    }

}
