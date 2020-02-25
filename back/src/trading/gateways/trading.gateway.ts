import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import ITradingAction from '../models/ITradingAction';
import ITradingStart from '../models/ITradingStart';
import { TradingInputMessage, TradingOutputMessage } from '../models/TradingMessage';
import { TradingService } from '../services/trading.service';

@WebSocketGateway({ namespace: 'trading' })
export class TradingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly tradingService: TradingService) { }

    // @WebSocketServer() server: Server;

    //#region Lifecycle

    handleConnection(client: Socket) {
        Logger.log(`Client Connected: ${client.id}`, TradingGateway.name)
    }

    handleDisconnect(client: Socket) {
        Logger.log(`Client Disconnected: ${client.id}`, TradingGateway.name)
        this.tradingService.deleteClient(client.id)
    }
    
    handleError(client: Socket, error: Error) {
        if (error instanceof Error) {
            this.tradingService.deleteClient(client.id)
            Logger.error(error.message, error.stack, TradingGateway.name)
            client.emit(TradingOutputMessage.Error, error.message)
        } else {
            Logger.error(error, Error().stack, TradingGateway.name)
            return client.emit(TradingOutputMessage.Error, 'Internal server error')
        }
    }

    handleFinish(client: Socket) {
        const result = this.tradingService.getClientResult(client.id)
        client.emit(TradingOutputMessage.Result, result)

        client.emit(TradingOutputMessage.End)

        this.tradingService.deleteClient(client.id)
    }

    //#endregion

    //#region Events

    @SubscribeMessage(TradingInputMessage.Start)
    async onStart(client: Socket, message: ITradingStart): Promise<void> {
        try {
            Logger.log(`Starting: ${client.id}\n@ ${JSON.stringify(message)}`, TradingGateway.name);

            await this.tradingService.createClient(client.id, message)

            const nextData = this.tradingService.getNextData(client.id)
            client.emit(TradingOutputMessage.Data, nextData)
        } catch (e) {
            this.handleError(client, e)
        }
    }

    @SubscribeMessage(TradingInputMessage.Action)
    async onNextResult(client: Socket, message: ITradingAction): Promise<void> {
        await new Promise((res,rej) => setTimeout(res, 2000))
        try {
            const warnings = this.tradingService.takeAction(client.id, message)
            warnings.forEach(e => client.emit(TradingOutputMessage.Warning, e))
            
            const nextData = this.tradingService.getNextData(client.id)

            if (nextData) {
                client.emit(TradingOutputMessage.Data, nextData)
            } else {
                Logger.log(`Ending: ${client.id}`, TradingGateway.name)
                this.handleFinish(client)
            }
        } catch (e) {
            this.handleError(client, e)
        }
    }

    @SubscribeMessage(TradingInputMessage.Stop)
    async onStop(client: Socket): Promise<void> {
        try {
            Logger.log(`Stoping: ${client.id}`, TradingGateway.name);
            this.handleFinish(client)
        } catch (e) {
            this.handleError(client, e)
        }
    }

    //#endregion
}



// Example
// @SubscribeMessage('start')
// onStart(client: Socket, message: string): void {
//     // Broadcast
//     // client.broadcast.emit('message', message + ' broadcast');
//     // this.server.emit('message', message + ' broadcast')

//     // Unicast
//     // client.emit('message', data)
//     // return { event: 'message', data: 'Hello, World!' } // WsResponse<string>

//     Logger.log(`Starting: ${client.id}`, TradingGateway.name);

//     client.emit('data', 0)
// }