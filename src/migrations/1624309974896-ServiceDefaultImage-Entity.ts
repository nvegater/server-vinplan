import { MigrationInterface, QueryRunner } from "typeorm";

export class ServiceDefaultImageEntity1624309974896
  implements MigrationInterface
{
  name = "ServiceDefaultImageEntity1624309974896";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "service_default_image_eventtype_enum" AS ENUM('Comida/Cena Maridaje', 'Degustación', 'Concierto')`
    );
    await queryRunner.query(
      `CREATE TABLE "service_default_image" ("id" SERIAL NOT NULL, "defaultImageUrl" character varying NOT NULL, "eventType" "service_default_image_eventtype_enum" NOT NULL, CONSTRAINT "PK_c2b298f0af5dfdb739a0fca92b3" PRIMARY KEY ("id"))`
    );
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
      `COMMENT ON COLUMN "service_image_gallery"."coverPage" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "service_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT 'false'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "winery_image_gallery"."coverPage" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT 'false'`
    );
    await queryRunner.query(
      `INSERT INTO public.service_default_image("defaultImageUrl", "eventType") VALUES('https://do-spaces-vinplan.fra1.digitaloceanspaces.com/assests/assests/experiences/degustacion-event.png', 'Comida/Cena Maridaje');`
    );
    await queryRunner.query(
      `INSERT INTO public.service_default_image("defaultImageUrl", "eventType") VALUES('https://do-spaces-vinplan.fra1.digitaloceanspaces.com/assests/assests/experiences/comida-event.png', 'Degustación');`
    );
    await queryRunner.query(
      `INSERT INTO public.service_default_image("defaultImageUrl", "eventType") VALUES('https://do-spaces-vinplan.fra1.digitaloceanspaces.com/assests/assests/experiences/concert-event.png', 'Concierto');`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT false`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "winery_image_gallery"."coverPage" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "service_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT false`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "service_image_gallery"."coverPage" IS NULL`
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
    await queryRunner.query(`DROP TABLE "service_default_image"`);
    await queryRunner.query(`DROP TYPE "service_default_image_eventtype_enum"`);
  }
}
