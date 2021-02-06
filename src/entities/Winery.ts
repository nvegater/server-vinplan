import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Service} from "./Service";
import {User} from "./User";
import {Field, Int, ObjectType, registerEnumType} from "type-graphql";
import {ProductionType, WineProductionType} from "./WineProductionType";
import {TypeWine, WineType} from "./WineType";

export enum Valley {
    "GUADALUPE"="Guadalupe",
    "SAN_ANT_MINAS"="San Antonio de las Minas",
    "ENSENADA"="Ensenada",
    "SANTO_TOMAS"="Santo Tomas",
    "OJOS_NEGROS"="Ojos Negros",
    "GRULLA"="La Grulla",
    "SAN_VICENTE"="San Vicente",
    "SAN_QUINTIN"="San Quintín"
}

registerEnumType(Valley, {
    name: "Valley",
    description: "A winery is in an unique valley, valleys are not identifiable through addresses"
});


@ObjectType()
@Entity()
export class Winery extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({unique: true})
    name!: string;

    @Field(() => String)
    @Column()
    description!: string;

    @Field(() => Int, {nullable: true})
    @Column({type: "int", nullable: true})
    foundationYear: number;

    // Winery posts multiple wineEvents. Each wineEvent done by user.
    @Field(() => [Service], {nullable: true})
    @OneToMany(() => Service, service => service.winery)
    services: Service[];

    @Field(() => String, {nullable: true})
    @Column({nullable: true})
    googleMapsUrl: string;

    @Field(() => Int, {nullable: true})
    @Column({nullable: true})
    yearlyWineProduction: number;

    @Field({nullable: true})
    @Column({nullable: true})
    contactEmail: string;

    @Field({nullable: true})
    @Column({nullable: true})
    contactPhoneNumber: string;

    @Field(() => Valley)
    @Column('enum', {name: 'valley', enum: Valley})
    valley: Valley;

    @Field(() => [ProductionType])
    @OneToMany(() => WineProductionType, wineProductionType => wineProductionType.winery)
    productionType: WineProductionType[];

    @Field(() => [TypeWine])
    @OneToMany(() => WineType, wineType => wineType.winery)
    wineType: WineType[];

    //FK
    @Column()
    creatorId: number;

    @ManyToOne(() => User, user => user.winery)
    creator: User;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}