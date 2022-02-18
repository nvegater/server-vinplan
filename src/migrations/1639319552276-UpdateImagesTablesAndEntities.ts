import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateImagesTablesAndEntities1639319552276 implements MigrationInterface {
    name = 'UpdateImagesTablesAndEntities1639319552276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_image" ("id" SERIAL NOT NULL, "creatorUsername" character varying NOT NULL, "imageUrl" character varying NOT NULL, "coverPage" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f776c999cfa0294c3c11876c71" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "winery_image" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "imageUrl" character varying NOT NULL, "coverPage" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_26a9eb488651030a12204da7580" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experience_image" ("id" SERIAL NOT NULL, "experienceId" integer NOT NULL, "imageUrl" character varying NOT NULL, "coverPage" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b5ba44c4f6738fbe2bede03f76c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "winery_image" ADD CONSTRAINT "FK_807946064a852e2fb0bc794c2b1" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_image" ADD CONSTRAINT "FK_6b15afc680cab41ff9956ce82f6" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_image" DROP CONSTRAINT "FK_6b15afc680cab41ff9956ce82f6"`);
        await queryRunner.query(`ALTER TABLE "winery_image" DROP CONSTRAINT "FK_807946064a852e2fb0bc794c2b1"`);
        await queryRunner.query(`DROP TABLE "experience_image"`);
        await queryRunner.query(`DROP TABLE "winery_image"`);
        await queryRunner.query(`DROP TABLE "user_image"`);
    }

}
