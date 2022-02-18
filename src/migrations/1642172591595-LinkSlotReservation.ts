import {MigrationInterface, QueryRunner} from "typeorm";

export class LinkSlotReservation1642172591595 implements MigrationInterface {
    name = 'LinkSlotReservation1642172591595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_f8ae249a9d0c1ca5c3874c50e60"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "experienceId"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "UQ_529dceb01ef681127fef04d755d"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "paymentCreationDateTime"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "paymentUpdateDateTime"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "email" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "username" text`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "paymentStatus" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "slotId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_b6c4978d84defc41e95060ea984" FOREIGN KEY ("slotId") REFERENCES "experience_slot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_b6c4978d84defc41e95060ea984"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "slotId"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "paymentStatus"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "paymentUpdateDateTime" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "paymentCreationDateTime" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "orderId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "UQ_529dceb01ef681127fef04d755d" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "experienceId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_f8ae249a9d0c1ca5c3874c50e60" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
