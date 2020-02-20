import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    super.catch(exception, host);

    const message =
      ('message' in exception)
      ? exception.message
      : exception

    const logError = `${message}`
    exception.stack
      ? Logger.error(logError, exception.stack)
      : Logger.error(logError)
  }
}