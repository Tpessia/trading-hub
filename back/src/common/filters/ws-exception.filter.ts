import { ArgumentsHost, Catch, Logger, WsExceptionFilter } from '@nestjs/common';
import { MESSAGES } from '@nestjs/core/constants';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class AllWsExceptionsFilter implements WsExceptionFilter<WsException> {
  catch(exception: WsException, host: ArgumentsHost) {
    const client: Socket = host.switchToWs().getClient()
    
    if (!(exception instanceof WsException)) {
      Logger.error(exception)
      return client.emit('error', MESSAGES.UNKNOWN_EXCEPTION_MESSAGE)
    }

    Logger.error(exception.message, exception.stack)
    client.emit('error', exception.message)
  }
}