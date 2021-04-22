import {MigrationInterface, QueryRunner} from "typeorm";

export class presignedUrls1618938270699 implements MigrationInterface {
    name = 'presignedUrls1618938270699'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "winery_image_gallery" ("id" serial NOT NULL,"wineryId" int4 NOT NULL,"imageUrl" varchar NULL,CONSTRAINT "PK_47cfffb4d1db79ebd472682b9be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ADD CONSTRAINT "FK_36a54f0c7d39372d59e94885e5a" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN urlImage VARCHAR;`);
    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
