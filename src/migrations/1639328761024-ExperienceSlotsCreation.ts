import {MigrationInterface, QueryRunner} from "typeorm";

export class ExperienceSlotsCreation1639328761024 implements MigrationInterface {
    name = 'ExperienceSlotsCreation1639328761024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."experience_slot_slottype_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "experience_slot" ("id" SERIAL NOT NULL, "startDateTime" TIMESTAMP NOT NULL, "endDateTime" TIMESTAMP NOT NULL, "slotType" "public"."experience_slot_slottype_enum" NOT NULL, "durationInMinutes" integer NOT NULL, "noOfAttendees" integer NOT NULL DEFAULT '0', "limitOfAttendees" integer NOT NULL, "experienceId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f6a54fd3ff7092456f6263470fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "startDateTime"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "endDateTime"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "limitOfAttendees"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "noOfAttendees"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "rRules"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "extraDates"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "allAttendeesAllSlots" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "experience_slot" ADD CONSTRAINT "FK_170f71da1d6dfe90ab60350f5a5" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_slot" DROP CONSTRAINT "FK_170f71da1d6dfe90ab60350f5a5"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "allAttendeesAllSlots"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "extraDates" text array DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "rRules" text array DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "noOfAttendees" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "limitOfAttendees" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "endDateTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "startDateTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`DROP TABLE "experience_slot"`);
        await queryRunner.query(`DROP TYPE "public"."experience_slot_slottype_enum"`);
    }

}
