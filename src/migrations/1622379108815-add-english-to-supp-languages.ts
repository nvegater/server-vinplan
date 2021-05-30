import {MigrationInterface, QueryRunner} from "typeorm";

export class addEnglishToSuppLanguages1622379108815 implements MigrationInterface {
    name = 'addEnglishToSuppLanguages1622379108815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "service"."rRules" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "rRules" SET DEFAULT '{}'::text[]`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."noOfAttendees" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "noOfAttendees" SET DEFAULT 0`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
        await queryRunner.query(`ALTER TYPE "public"."winery_language_supportedlanguage_enum" RENAME TO "winery_language_supportedlanguage_enum_old"`);
        await queryRunner.query(`CREATE TYPE "winery_language_supportedlanguage_enum" AS ENUM('Inglés', 'Español', 'Lenguage de señas mexicanas', 'Francés', 'Alemán', 'Italiano', 'Portugués', 'Japones', 'Mandarín')`);
        await queryRunner.query(`ALTER TABLE "winery_language" ALTER COLUMN "supportedLanguage" TYPE "winery_language_supportedlanguage_enum" USING "supportedLanguage"::"text"::"winery_language_supportedlanguage_enum"`);
        await queryRunner.query(`DROP TYPE "winery_language_supportedlanguage_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "winery_language"."supportedLanguage" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "winery_image_gallery"."coverPage" IS NULL`);
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ALTER COLUMN "coverPage" SET DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "winery_image_gallery"."coverPage" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "winery_language"."supportedLanguage" IS NULL`);
        await queryRunner.query(`CREATE TYPE "winery_language_supportedlanguage_enum_old" AS ENUM('Español', 'Lenguage de señas mexicanas', 'Francés', 'Alemán', 'Italiano', 'Portugués', 'Japones', 'Mandarín')`);
        await queryRunner.query(`ALTER TABLE "winery_language" ALTER COLUMN "supportedLanguage" TYPE "winery_language_supportedlanguage_enum_old" USING "supportedLanguage"::"text"::"winery_language_supportedlanguage_enum_old"`);
        await queryRunner.query(`DROP TYPE "winery_language_supportedlanguage_enum"`);
        await queryRunner.query(`ALTER TYPE "winery_language_supportedlanguage_enum_old" RENAME TO  "winery_language_supportedlanguage_enum"`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "noOfAttendees" SET DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."noOfAttendees" IS NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "rRules" SET DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "service"."rRules" IS NULL`);
    }

}
