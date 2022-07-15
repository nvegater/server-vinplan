import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1657298913917 implements MigrationInterface {
    name = 'Init1657298913917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."wine_production_type_productiontype_enum" AS ENUM('Comercial', 'Tradicional - Artesanal', 'Orgánico / Biodinámica / Naturales')`);
        await queryRunner.query(`CREATE TABLE "wine_production_type" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "productionType" "public"."wine_production_type_productiontype_enum" NOT NULL, CONSTRAINT "PK_a6d20cd09f64661ef2ad9702706" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."wine_type_winetype_enum" AS ENUM('Blanco', 'Blanco con barrica', 'Rosado', 'Tinto crianza', 'Tinto reserva', 'Tinto gran Reserva', 'Generoso / Fortificado', 'Espumoso', 'Cosecha Tardía', 'Conmemorativos / Edición limitada', 'Orgánico', 'Biodinámico', 'Otro')`);
        await queryRunner.query(`CREATE TABLE "wine_type" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "wineType" "public"."wine_type_winetype_enum" NOT NULL, CONSTRAINT "PK_ca3ce8d6447553e3d6328e7738c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."winery_amenity_amenity_enum" AS ENUM('Terraza al aire libre', 'Degustación de vinos', 'Recorridos en viñedos', 'Recorridos en bodega', 'Paseo en carreta', 'Visita la cava de barricas', 'Cata de barricas', 'Crea tu mezcla de vino', 'Talleres didácticos', 'Catas maridajes', 'Catas privadas', 'Actividades en viñedo')`);
        await queryRunner.query(`CREATE TABLE "winery_amenity" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "amenity" "public"."winery_amenity_amenity_enum" NOT NULL, CONSTRAINT "PK_c6f18575c854eabe9962b3274c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."winery_language_supportedlanguage_enum" AS ENUM('Inglés', 'Español', 'Lenguage de señas mexicanas', 'Francés', 'Alemán', 'Italiano', 'Portugués', 'Japones', 'Mandarín')`);
        await queryRunner.query(`CREATE TABLE "winery_language" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "supportedLanguage" "public"."winery_language_supportedlanguage_enum" NOT NULL, CONSTRAINT "PK_26c748e5193e9c32f5e8b79335a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."wine_grapes_production_winegrapesproduction_enum" AS ENUM('Aglianico', 'Barbera', 'Brunello', 'Cabernet Franc', 'Cabernet Sauvignon', 'Carignan', 'Chardonnay', 'Chenin Blanc', 'Cinsaul', 'Colombard', 'Gewurztraminer', 'Grenache', 'Grenache Blanc', 'Malbec', 'Malvasia Blanca', 'Malvasia Tinta', 'Merlot', 'Mision', 'Montepulciano', 'Moscatel', 'Mourvedre', 'Nebbiolo', 'Palomino', 'Petite Verdot', 'Pinot Blanc', 'Pinot Gris', 'Pinot Noir', 'Riesling', 'Rubi Cabernet', 'Sangiovese', 'Sauvignon Blanc', 'Semillon', 'Sinsault', 'Syrah', 'Tempranillo', 'Viognier', 'Zinfandel', 'Otra')`);
        await queryRunner.query(`CREATE TABLE "wine_grapes_production" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "wineGrapesProduction" "public"."wine_grapes_production_winegrapesproduction_enum" NOT NULL, CONSTRAINT "PK_15a41ca39f1a56ae12789ac4413" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."winery_other_services_otherservices_enum" AS ENUM('Hospedaje', 'Restaurante', 'Barra de Alimentos (Tapas)')`);
        await queryRunner.query(`CREATE TABLE "winery_other_services" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "OtherServices" "public"."winery_other_services_otherservices_enum" NOT NULL, CONSTRAINT "PK_6fa8c02a5ca52b6c7ef3b0d3a16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_image" ("id" SERIAL NOT NULL, "creatorUsername" character varying NOT NULL, "imageName" text NOT NULL, "coverPage" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f776c999cfa0294c3c11876c71" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "winery_image" ("id" SERIAL NOT NULL, "wineryId" integer NOT NULL, "wineryAlias" text NOT NULL, "imageName" text NOT NULL, "coverPage" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_26a9eb488651030a12204da7580" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experience_image" ("id" SERIAL NOT NULL, "experienceId" integer NOT NULL, "imageName" text NOT NULL, "coverPage" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b5ba44c4f6738fbe2bede03f76c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."winery_valley_enum" AS ENUM('Guadalupe', 'San Antonio de las Minas', 'Ensenada', 'Santo Tomas', 'Ojos Negros', 'La Grulla', 'San Vicente', 'San Quintín', 'Calafia')`);
        await queryRunner.query(`CREATE TABLE "winery" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "urlAlias" character varying NOT NULL, "stripe_customerId" character varying, "subscription" character varying, "accountId" character varying, "accountCreatedTime" integer NOT NULL DEFAULT '-1', "creatorUsername" character varying NOT NULL, "creatorEmail" character varying NOT NULL, "description" character varying NOT NULL, "foundationYear" integer, "googleMapsUrl" character varying, "yearlyWineProduction" integer, "contactEmail" character varying, "contactPhoneNumber" character varying, "verified" boolean NOT NULL DEFAULT false, "covidLabel" boolean NOT NULL DEFAULT false, "logo" character varying, "contactName" character varying, "productRegion" character varying, "postalAddress" character varying, "architecturalReferences" boolean, "younerFriendly" boolean, "petFriendly" boolean, "enologoName" character varying, "handicappedFriendly" boolean, "valley" "public"."winery_valley_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_15a1e7033c1dbe2819d9bccc56f" UNIQUE ("name"), CONSTRAINT "UQ_ad64399256d30eb9a6fd5196a33" UNIQUE ("urlAlias"), CONSTRAINT "UQ_df9194396c0dd5a365657fcb648" UNIQUE ("creatorUsername"), CONSTRAINT "UQ_22263b9e94e5887e2c2368494d5" UNIQUE ("creatorEmail"), CONSTRAINT "PK_40fd8e2fcc28d2644d746fda101" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" SERIAL NOT NULL, "title" character varying(63) NOT NULL, "email" text NOT NULL, "wineryName" text NOT NULL, "username" text, "noOfAttendees" integer NOT NULL, "pricePerPersonInDollars" double precision NOT NULL, "paymentStatus" character varying NOT NULL, "slotId" integer NOT NULL, "experienceId" integer NOT NULL, "startDateTime" TIMESTAMP WITH TIME ZONE NOT NULL, "endDateTime" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."experience_slot_slottype_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "experience_slot" ("id" SERIAL NOT NULL, "startDateTime" TIMESTAMP WITH TIME ZONE NOT NULL, "endDateTime" TIMESTAMP WITH TIME ZONE NOT NULL, "slotType" "public"."experience_slot_slottype_enum" NOT NULL, "durationInMinutes" integer NOT NULL, "noOfAttendees" integer NOT NULL DEFAULT '0', "limitOfAttendees" integer NOT NULL, "pricePerPersonInDollars" double precision NOT NULL, "experienceId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f6a54fd3ff7092456f6263470fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."experience_experiencetype_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "experience" ("id" SERIAL NOT NULL, "title" character varying(63) NOT NULL, "description" character varying(255) NOT NULL, "experienceType" "public"."experience_experiencetype_enum" NOT NULL, "allAttendeesAllSlots" integer NOT NULL DEFAULT '0', "pricePerPersonInDollars" double precision NOT NULL, "wineryId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5e8d5a534100e1b17ee2efa429a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "stripeCustomerId" character varying NOT NULL, "email" character varying NOT NULL, "username" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wine_production_type" ADD CONSTRAINT "FK_9a49aa304279cce68643dc564b6" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wine_type" ADD CONSTRAINT "FK_e24c3c0efd32079390836fd0a87" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "winery_amenity" ADD CONSTRAINT "FK_4083c81148ae1817a81ed057613" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "winery_language" ADD CONSTRAINT "FK_8d8a037a51b67e55d22923981b7" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wine_grapes_production" ADD CONSTRAINT "FK_d5efed0d81dd5a9b001ac7e54f0" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "winery_other_services" ADD CONSTRAINT "FK_6cc398dd7b2383db976495eb6bc" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "winery_image" ADD CONSTRAINT "FK_807946064a852e2fb0bc794c2b1" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_image" ADD CONSTRAINT "FK_6b15afc680cab41ff9956ce82f6" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_b6c4978d84defc41e95060ea984" FOREIGN KEY ("slotId") REFERENCES "experience_slot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_slot" ADD CONSTRAINT "FK_170f71da1d6dfe90ab60350f5a5" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience" ADD CONSTRAINT "FK_391f568221ffffee7078066ec65" FOREIGN KEY ("wineryId") REFERENCES "winery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" DROP CONSTRAINT "FK_391f568221ffffee7078066ec65"`);
        await queryRunner.query(`ALTER TABLE "experience_slot" DROP CONSTRAINT "FK_170f71da1d6dfe90ab60350f5a5"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_b6c4978d84defc41e95060ea984"`);
        await queryRunner.query(`ALTER TABLE "experience_image" DROP CONSTRAINT "FK_6b15afc680cab41ff9956ce82f6"`);
        await queryRunner.query(`ALTER TABLE "winery_image" DROP CONSTRAINT "FK_807946064a852e2fb0bc794c2b1"`);
        await queryRunner.query(`ALTER TABLE "winery_other_services" DROP CONSTRAINT "FK_6cc398dd7b2383db976495eb6bc"`);
        await queryRunner.query(`ALTER TABLE "wine_grapes_production" DROP CONSTRAINT "FK_d5efed0d81dd5a9b001ac7e54f0"`);
        await queryRunner.query(`ALTER TABLE "winery_language" DROP CONSTRAINT "FK_8d8a037a51b67e55d22923981b7"`);
        await queryRunner.query(`ALTER TABLE "winery_amenity" DROP CONSTRAINT "FK_4083c81148ae1817a81ed057613"`);
        await queryRunner.query(`ALTER TABLE "wine_type" DROP CONSTRAINT "FK_e24c3c0efd32079390836fd0a87"`);
        await queryRunner.query(`ALTER TABLE "wine_production_type" DROP CONSTRAINT "FK_9a49aa304279cce68643dc564b6"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "experience"`);
        await queryRunner.query(`DROP TYPE "public"."experience_experiencetype_enum"`);
        await queryRunner.query(`DROP TABLE "experience_slot"`);
        await queryRunner.query(`DROP TYPE "public"."experience_slot_slottype_enum"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP TABLE "winery"`);
        await queryRunner.query(`DROP TYPE "public"."winery_valley_enum"`);
        await queryRunner.query(`DROP TABLE "experience_image"`);
        await queryRunner.query(`DROP TABLE "winery_image"`);
        await queryRunner.query(`DROP TABLE "user_image"`);
        await queryRunner.query(`DROP TABLE "winery_other_services"`);
        await queryRunner.query(`DROP TYPE "public"."winery_other_services_otherservices_enum"`);
        await queryRunner.query(`DROP TABLE "wine_grapes_production"`);
        await queryRunner.query(`DROP TYPE "public"."wine_grapes_production_winegrapesproduction_enum"`);
        await queryRunner.query(`DROP TABLE "winery_language"`);
        await queryRunner.query(`DROP TYPE "public"."winery_language_supportedlanguage_enum"`);
        await queryRunner.query(`DROP TABLE "winery_amenity"`);
        await queryRunner.query(`DROP TYPE "public"."winery_amenity_amenity_enum"`);
        await queryRunner.query(`DROP TABLE "wine_type"`);
        await queryRunner.query(`DROP TYPE "public"."wine_type_winetype_enum"`);
        await queryRunner.query(`DROP TABLE "wine_production_type"`);
        await queryRunner.query(`DROP TYPE "public"."wine_production_type_productiontype_enum"`);
    }

}
