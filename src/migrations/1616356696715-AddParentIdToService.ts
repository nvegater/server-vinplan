import {MigrationInterface, QueryRunner} from "typeorm";

export class AddParentIdToService1616356696715 implements MigrationInterface {
    name = 'AddParentIdToService1616356696715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "service"."rRules" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "rRules" SET DEFAULT '{}'::text[]`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "rRules" SET DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."rRules" IS NULL`);
    }

}
