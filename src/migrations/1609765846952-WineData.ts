import {MigrationInterface, QueryRunner} from "typeorm";

export class WineData1609765846952 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
          
        insert into winery (id, name, description, "foundationYear", "creatorId", "googleMapsUrl", valley ) values (100, 
                                                                                          'Viñas del sol', 'Fue a finales del siglo XX que se diversifico la oferta de vino nacional y es a partir de la década del año 2010 que Viñas del Sol se coloca como el primer viñedo orgánico en México. Una expresión del universo en cada botella Viñas del Sol nace con la intención de aprender de la tierra, de cuidarla profundamente y respetarla. El entorno; un lugar libre de químicos o influencias de derivados y una abundancia de nutrientes que se rigen bajo las leyes de la naturaleza. Biodinámica Una filosofía de vida en la que nos inspiramos para el origen de nuestros vinos. Una filosofía que se basa en el amor, respeto y cuidado a la tierra primeramente, lo que conlleva hacer conciencia de la magnitud de interconexiones de microorganismos que intervienen en todos los procesos para que el varietal exprese su potencial. La biodinámica nos ha enseñado a ver el cosmos como un todo; un todo que interactúa de forma permanente, se puede ver en el campo la unidad de producción totalmente interrelacionada, este espacio de tierra del que somos parte es un ser vivo que crece y se desarrolla constantemente y describe la armonía perfecta entre energía y moléculas orgánicas en su proceso de metabolismo.',
                                                                                          2010,
                                                                                          1,'https://goo.gl/maps/ciCxHaYAivfuLqaB8', 'Guadalupe');
        insert into winery (id, name, description, "foundationYear", "creatorId", "googleMapsUrl", valley ) values (200, 
                                                                                  'Vinisterra Vitivinícola', 'Nace de la amistad del empresario ensenadense Guillermo Rodríguez y el Enólogo Christoph Gaertner y su pasión por el vino y la tierra de los Valles de Ensenada. Somos una bodega micro-productora con 15 colaboradores y elaboramos 50,000 botellas de vino al año, con profundo respeto a nuestra tierra y nuestra gente, tratando de expresar con orgullo el carácter de Baja California en nuestro vino. En nuestros viñedos en el Valle de Santo Tomás y en el Valle de Guadalupe crece la uva de nuestros vinos en una superficie total de 11 hectáreas. Nuestra vinícola está hecha de ladrillo fabricado con la tierra del poblado. Tratamos de trabajar con una enología de mínima intervención para que así los vinos de cada una de nuestras parcelas se expresen de la manera más pura posible.'
                                                                                  , 2002, 1, 'https://goo.gl/maps/peEH3ZbpuFboUxUA9', 'Guadalupe');

        insert into winery (id, name, description, "foundationYear", "creatorId", "googleMapsUrl", valley ) values (300, 
                                                                                  'Montaño Benson Vitivinicultores', 'Somos una vinícola en desarrollo en San Antonio de las Minas, dedicada a producir vinos en pequeñas cantidades, de una alta calidad. Nos encanta recibir visitantes e invitarlos a disfrutar de nuestro vino y comida de temporada. Nos dedicamos a vinificar pequeñas cantidades de diferentes variedades para después buscar mezclas que produzcan vinos únicos, diferentes. Nuestras variedades favoritas: Petite Sirah, Barbera, Zinfandel, Cabernet Sauvignon, Monastrel.',
                                                                                  2011, 
                                                                                  1,
                                                                                  'https://goo.gl/maps/j8zpSM1GJDAaEr5v7', 'Guadalupe'
                                                                                  );

        insert into wine_production_type ("wineryId", "productionType")
        VALUES (100, 'Comercial');
        insert into wine_production_type ("wineryId", "productionType")
        VALUES (200, 'Comercial');
        insert into wine_production_type ("wineryId", "productionType")
        VALUES (300, 'Comercial');

        insert into wine_type ("wineryId", "wineType")
        VALUES (100, 'Tinto joven');
        insert into wine_type ("wineryId", "wineType")
        VALUES (200, 'Tinto joven');
        insert into wine_type ("wineryId", "wineType")
        VALUES (300, 'Tinto joven');

        insert into wine_type ("wineryId", "wineType")
        VALUES (100, 'Orgánico');
        insert into wine_type ("wineryId", "wineType")
        VALUES (200, 'Orgánico');
        insert into wine_type ("wineryId", "wineType")
        VALUES (300, 'Orgánico');
        `)

    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
    }

}
