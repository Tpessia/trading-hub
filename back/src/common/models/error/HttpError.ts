import HttpStatusCode from './HttpStatusCode';

export default class HttpError extends Error {
    code: HttpStatusCode

    constructor(code: number, message: string) {
        super(message)

        this.code = code

        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name

        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        // @see Node.js reference (https://nodejs.org/api/errors.html)
        Error.captureStackTrace(this, this.constructor)
    }
}

export function isHttpError(error: Error | HttpError): error is HttpError {
    return (error as HttpError).code !== undefined;
}