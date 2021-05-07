import {MigrationInterface, QueryRunner} from "typeorm";

export class initDb1620394736065 implements MigrationInterface {
    name = 'initDb1620394736065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "upvote" ("userId" integer NOT NULL, "postId" integer NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_802ac6b9099f86aa24eb22d9c05" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`CREATE TABLE "service_reservation" ("userId" integer NOT NULL, "serviceId" integer NOT NULL, "serviceCreatorId" integer, "noOfAttendees" integer, "paypalOrderId" character varying NOT NULL, "status" character varying NOT NULL, "paymentCreationDateTime" character varying NOT NULL, "pricePerPersonInDollars" double precision, CONSTRAINT "PK_0b16ac8260a9c26430df296e142" PRIMARY KEY ("userId", "serviceId"))`);
        await queryRunner.query(`CREATE TYPE "service_eventtype_enum" AS ENUM('Comida/Cena Maridaje', 'Degustación', 'Concierto')`);
        await queryRunner.query(`CREATE TABLE "service" ("id" SERIAL NOT NULL, "title" character varying(63) NOT NULL, "description" character varying(255) NOT NULL, "eventType" "service_eventtype_enum" NOT NULL, "startDateTime" TIMESTAMP NOT NULL, "endDateTime" TIMESTAMP NOT NULL, "rRules" text array DEFAULT '{}'::text[], "wineryId" integer NOT NULL, "creatorId" integer NOT NULL, "parentServiceId" integer, "duration" integer NOT NULL, "limitOfAttendees" integer, "noOfAttendees" integer NOT NULL DEFAULT 0, "pricePerPersonInDollars" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "wine_production_type_productiontype_enum" AS ENUM('Comercial', 'Tradicional - Artesanal', 'Orgánico / Biodinámica / Naturales')`);
        await queryRunner.query(`CREATE TABLE "wine_production_type" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "productionType" "wine_production_type_productiontype_enum" NOT NULL, CONSTRAINT "PK_a6d20cd09f64661ef2ad9702706" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "wine_type_winetype_enum" AS ENUM('Blanco', 'Rosado', 'Tinto joven', 'Tinto crianza (con barrica)', 'Generoso / fortificado', 'Espumoso', 'Naranja', 'Dulce', 'Cosecha Tardía', 'Vinos conmemorativos o edición limitada', 'Vino exclusivo de venta en el lugar', 'Orgánico', 'Biodinámico', 'Natural')`);
        await queryRunner.query(`CREATE TABLE "wine_type" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "wineType" "wine_type_winetype_enum" NOT NULL, CONSTRAINT "PK_ca3ce8d6447553e3d6328e7738c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "winery_amenity_amenity_enum" AS ENUM('Terraza al aire libre', 'Degustación de vinos', 'Recorridos en viñedos', 'Recorridos en bodega', 'Paseo en carreta', 'Visita la cava de barricas', 'Cata de barricas', 'Crea tu mezcla de vino', 'Talleres didácticos', 'Catas maridajes', 'Catas privadas', 'Actividades en viñedo')`);
        await queryRunner.query(`CREATE TABLE "winery_amenity" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "amenity" "winery_amenity_amenity_enum" NOT NULL, CONSTRAINT "PK_c6f18575c854eabe9962b3274c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "winery_language_supportedlanguage_enum" AS ENUM('Español', 'Lenguage de señas mexicanas', 'Francés', 'Alemán', 'Italiano', 'Portugués', 'Japones', 'Mandarín')`);
        await queryRunner.query(`CREATE TABLE "winery_language" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "supportedLanguage" "winery_language_supportedlanguage_enum" NOT NULL, CONSTRAINT "PK_26c748e5193e9c32f5e8b79335a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "winery_valley_enum" AS ENUM('Guadalupe', 'San Antonio de las Minas', 'Ensenada', 'Santo Tomas', 'Ojos Negros', 'La Grulla', 'San Vicente', 'San Quintín')`);
        await queryRunner.query(`CREATE TABLE "winery" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "foundationYear" integer, "googleMapsUrl" character varying, "yearlyWineProduction" integer, "contactEmail" character varying, "contactPhoneNumber" character varying, "valley" "winery_valley_enum" NOT NULL, "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_15a1e7033c1dbe2819d9bccc56f" UNIQUE ("name"), CONSTRAINT "PK_40fd8e2fcc28d2644d746fda101" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "user_usertype_enum" AS ENUM('Turista', 'Enoturista', 'Profesional', 'Empresarial', 'Intermediario', 'Winery_Owner')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "urlImage" character varying, "password" character varying NOT NULL, "visitorOrOwner" boolean NOT NULL DEFAULT false, "userType" "user_usertype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_638bac731294171648258260ff2" UNIQUE ("password"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "points" integer NOT NULL DEFAULT '0', "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "winery_image_gallery" ("id" SERIAL NOT NULL, "wineryId" integer, "imageUrl" character varying, "coverPage" boolean NOT NULL DEFAULT 'false', CONSTRAINT "PK_47cfffb4d1db79ebd472682b9be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "upvote" ADD CONSTRAINT "FK_3abd9f37a94f8db3c33bda4fdae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "upvote" ADD CONSTRAINT "FK_efc79eb8b81262456adfcb87de1" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_reservation" ADD CONSTRAINT "FK_b4e0d81b3bd0aad6b0e4559ce41" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_reservation" ADD CONSTRAINT "FK_43bcae15c887838a2bf0653b2d5" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "FK_a17a9ee13ebe91cc9fdc1a8a3f2" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "FK_3c429604394ec0c0b5ccc04cd29" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wine_production_type" ADD CONSTRAINT "FK_9a49aa304279cce68643dc564b6" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wine_type" ADD CONSTRAINT "FK_e24c3c0efd32079390836fd0a87" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "winery_amenity" ADD CONSTRAINT "FK_4083c81148ae1817a81ed057613" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "winery_language" ADD CONSTRAINT "FK_8d8a037a51b67e55d22923981b7" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "winery" ADD CONSTRAINT "FK_2376fb93971f08aaf511425b7fb" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b"`);
        await queryRunner.query(`ALTER TABLE "winery" DROP CONSTRAINT "FK_2376fb93971f08aaf511425b7fb"`);
        await queryRunner.query(`ALTER TABLE "winery_language" DROP CONSTRAINT "FK_8d8a037a51b67e55d22923981b7"`);
        await queryRunner.query(`ALTER TABLE "winery_amenity" DROP CONSTRAINT "FK_4083c81148ae1817a81ed057613"`);
        await queryRunner.query(`ALTER TABLE "wine_type" DROP CONSTRAINT "FK_e24c3c0efd32079390836fd0a87"`);
        await queryRunner.query(`ALTER TABLE "wine_production_type" DROP CONSTRAINT "FK_9a49aa304279cce68643dc564b6"`);
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_3c429604394ec0c0b5ccc04cd29"`);
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_a17a9ee13ebe91cc9fdc1a8a3f2"`);
        await queryRunner.query(`ALTER TABLE "service_reservation" DROP CONSTRAINT "FK_43bcae15c887838a2bf0653b2d5"`);
        await queryRunner.query(`ALTER TABLE "service_reservation" DROP CONSTRAINT "FK_b4e0d81b3bd0aad6b0e4559ce41"`);
        await queryRunner.query(`ALTER TABLE "upvote" DROP CONSTRAINT "FK_efc79eb8b81262456adfcb87de1"`);
        await queryRunner.query(`ALTER TABLE "upvote" DROP CONSTRAINT "FK_3abd9f37a94f8db3c33bda4fdae"`);
        await queryRunner.query(`DROP TABLE "winery_image_gallery"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_usertype_enum"`);
        await queryRunner.query(`DROP TABLE "winery"`);
        await queryRunner.query(`DROP TYPE "winery_valley_enum"`);
        await queryRunner.query(`DROP TABLE "winery_language"`);
        await queryRunner.query(`DROP TYPE "winery_language_supportedlanguage_enum"`);
        await queryRunner.query(`DROP TABLE "winery_amenity"`);
        await queryRunner.query(`DROP TYPE "winery_amenity_amenity_enum"`);
        await queryRunner.query(`DROP TABLE "wine_type"`);
        await queryRunner.query(`DROP TYPE "wine_type_winetype_enum"`);
        await queryRunner.query(`DROP TABLE "wine_production_type"`);
        await queryRunner.query(`DROP TYPE "wine_production_type_productiontype_enum"`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`DROP TYPE "service_eventtype_enum"`);
        await queryRunner.query(`DROP TABLE "service_reservation"`);
        await queryRunner.query(`DROP TABLE "upvote"`);
    }

}
