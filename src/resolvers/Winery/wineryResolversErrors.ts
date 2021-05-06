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
    imageNotFound = "imageNotFound",
    allWineries = "allWineries",
}

const imageNotInserted: FieldError = {
    field: Fields.imageNotInserted,
    message: "The image couldn't be inserted",
}

const imageNotFound: FieldError = {
    field: Fields.imageNotFound,
    message: "Image not found",
}

const wineryNotFound: FieldError = {
    field: Fields.allWineries,
    message: "All wineries find one is undefined"
} 

const wineryResolverErrors = {
    imageNotInserted,
    imageNotFound,
    wineryNotFound,
};

export default wineryResolverErrors;