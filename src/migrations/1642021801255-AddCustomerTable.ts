import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCustomerTable1642021801255 implements MigrationInterface {
    name = 'AddCustomerTable1642021801255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "stripeCustomerId" character varying NOT NULL, "email" character varying NOT NULL, "username" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "experience_slot" ADD "pricePerPersonInDollars" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_slot" DROP COLUMN "pricePerPersonInDollars"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
