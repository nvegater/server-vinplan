import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

export const customError = (field: string, message: string) => ({
  errors: [
    {
      field: field,
      message: message,
    },
  ],
});
