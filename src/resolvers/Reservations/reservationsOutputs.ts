import {Field, ObjectType} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";
import {ServiceReservation} from "../../entities/ServiceReservation";
import {UserType} from "../User/userResolversInputs";

@ObjectType()
export class ReservationResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => [ReservationDetails], {nullable: true})
    reservations?: ReservationDetails[]
    @Field()
    moreReservationsAvailable: boolean;
}

@ObjectType()
export class UserFromReservation {
    @Field()
    id: number;
    @Field()
    username: string;
    @Field(() => UserType)
    userType: UserType
}

@ObjectType()
export class ServiceFromReservation {
    @Field()
    id: number;
    @Field()
    noOfAttendees: number;
    @Field()
    pricePerPersonInDollars: number;
    @Field()
    startDateTime: string;
}
@ObjectType()
export class ReservationDetails extends ServiceReservation {
    @Field(() => UserFromReservation)
    userFromReservation: UserFromReservation;
    @Field(() => ServiceFromReservation)
    serviceFromReservation: ServiceFromReservation;
}

