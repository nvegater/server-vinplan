import {MigrationInterface, QueryRunner} from "typeorm";

export class addCoverPageWineryImageGallery1619562150769 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "winery_image_gallery" ADD COLUMN "coverPage" boolean;`);
    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
