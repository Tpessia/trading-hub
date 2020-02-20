import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter<any> {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      (exception instanceof HttpException)
      ? exception.message
      : ('message' in exception)
      ? exception.message
      : exception

    const logError = `${message}\n@ ${request.url}`
    exception.stack
      ? Logger.error(logError, exception.stack)
      : Logger.error(logError)

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}