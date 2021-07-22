import {FieldError} from "../resolvers/Winery/wineryResolversErrors";

interface AsyncAwaitFnInputs {
    asyncFn: (...props:any) => Promise<any>;
    errorField: string;
    errorMessage: string;
}

type AsyncAwaitFnOutput = Promise<[any, FieldError | null]>

type AsyncAwaitErrorHandlingFn = ( props:AsyncAwaitFnInputs ) => AsyncAwaitFnOutput

const asyncAwaitErrorHandling:AsyncAwaitErrorHandlingFn = async (props) => {
    try {
        const data = await props.asyncFn();
        return [data, null];

    } catch (error) {
        console.error(error)
        const fieldError:FieldError = { field: props.errorField, message: props.errorMessage}
        return [null, fieldError]
    }
}

export default asyncAwaitErrorHandling;