import { MigrationInterface, QueryRunner } from "typeorm";

export class wineryEnologoName1627725414838 implements MigrationInterface {
  name = "wineryEnologoName1627725414838";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.winery ALTER COLUMN "enologoName" TYPE varchar USING "enologoName"::varchar;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.winery ALTER COLUMN "enologoName" TYPE bool USING "enologoName"::bool;`
    );
  }
}
