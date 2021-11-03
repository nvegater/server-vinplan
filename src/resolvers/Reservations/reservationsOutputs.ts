import { Field, ObjectType } from "type-graphql";
import { FieldError } from "../User/userResolversOutputs";
import { ServiceReservation } from "../../entities/ServiceReservation";
import { User } from "../../entities/User";
import { Service } from "../../entities/Service";
import { UserType } from "../User/userResolversInputs";

@ObjectType()
export class ReservationResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [ReservationDetails], { nullable: true })
  reservations?: ReservationDetails[];
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
  userType: UserType;
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

@ObjectType()
export class ReservationsWinery extends ServiceReservation {
  @Field(() => User, { nullable: true })
  user_info?: User;
  @Field(() => Service, { nullable: true })
  experience_info?: Service;
}
