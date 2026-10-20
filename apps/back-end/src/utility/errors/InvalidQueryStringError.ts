import APIError from "src/utility/errors/APIError";
import DataError from "src/utility/errors/DataError";
import { LexiconErrorCode } from "src/utility/errors/LexiconErrorCode";
import z, { ZodError } from "zod";

interface InvalidQueryStringErrorPayload {
    query: unknown
}

class InvalidQueryStringError extends DataError<InvalidQueryStringErrorPayload, LexiconErrorCode> {
    public constructor(data: InvalidQueryStringErrorPayload, parsingError: ZodError){
        super(data, "INVALID_QUERY_STRING", `The provided query string is invalid:\n\n${z.prettifyError(parsingError)}`)
    }

    public override toAPIError(): APIError<object, LexiconErrorCode> {
        return new APIError(400, this.code, this.message, this.data)
    }
}

export default InvalidQueryStringError
