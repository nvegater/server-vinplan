import {Field, ObjectType} from "type-graphql";

@ObjectType()
export class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

enum Fields {
    imageNotInserted = "imageNotInserted",
    imageNotFound = "imageNotFound"
}

//TODO: cambiar al wineryResolverErrors
const imageNotInserted: FieldError = {
    field: Fields.imageNotInserted,
    message: "the image couldn't be inserted",
}

const imageNotFound: FieldError = {
    field: Fields.imageNotFound,
    message: "Image not found",
}

const wineryResolverErrors = {
    imageNotInserted,
    imageNotFound
};

export default wineryResolverErrors;