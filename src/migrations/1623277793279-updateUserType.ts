import { MigrationInterface, QueryRunner } from "typeorm";

export class updateUserType1623277793279 implements MigrationInterface {
  name = "updateUserType1623277793279";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "service"."rRules" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "service" ALTER COLUMN "rRules" SET DEFAULT '{}'::text[]`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "service"."noOfAttendees" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "service" ALTER COLUMN "noOfAttendees" SET DEFAULT 0`
    );
    await queryRunner.query(`COMMENT ON COLUMN "service"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_usertype_enum" RENAME TO "user_usertype_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "user_usertype_enum" AS ENUM('Winery_Owner', 'Wine_Tourist', 'Hotel', 'Transportation_Company', 'Concierge', 'Tour_Operator', 'Distributor', 'Press', 'Sommelier', 'Tourist_Guide', 'Driver', 'Travel_Agency', 'Dmc', 'Ocv', 'Event_planner')`
    );
    //Modificaciones propias para cambiar el tipo de datos
    await queryRunner.query(`ALTER TABLE "user" 
        ALTER COLUMN "userType" 
        TYPE "user_usertype_enum" 
        USING(
        CASE when "userType"::text in (
            'Turista',
            'Enoturista',
            'Profesional',
            'Empresarial',
            'Intermediario'
        ) then 'Wine_Tourist'
        else "userType"::text
        END)::"user_usertype_enum";`);
    //fin script propio
    await queryRunner.query(`DROP TYPE "user_usertype_enum_old"`);
    await queryRunner.query(`COMMENT ON COLUMN "user"."userType" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "winery_image_gallery"."coverPage" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT 'false'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT false`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "winery_image_gallery"."coverPage" IS NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "user"."userType" IS NULL`);
    await queryRunner.query(
      `CREATE TYPE "user_usertype_enum_old" AS ENUM('Turista', 'Enoturista', 'Profesional', 'Empresarial', 'Intermediario', 'Winery_Owner', 'Wine_Tourist')`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "userType" TYPE "user_usertype_enum_old" USING "userType"::"text"::"user_usertype_enum_old"`
    );
    await queryRunner.query(`DROP TYPE "user_usertype_enum"`);
    await queryRunner.query(
      `ALTER TYPE "user_usertype_enum_old" RENAME TO  "user_usertype_enum_old"`
    );
    await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "service"."createdAt" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "service" ALTER COLUMN "noOfAttendees" SET DEFAULT '0'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "service"."noOfAttendees" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "service" ALTER COLUMN "rRules" SET DEFAULT '{}'`
    );
    await queryRunner.query(`COMMENT ON COLUMN "service"."rRules" IS NULL`);
  }
}
