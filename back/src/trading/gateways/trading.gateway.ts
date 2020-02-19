import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: 'trading' })
export class TradingGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.log('123')
    }

    handleConnection(client: Socket) {
        console.log(`Client Connected: ${client.id}`)
    }

    handleDisconnect(client: Socket) {
        console.log(`Client Disconnected: ${client.id}`)
    }

    genData = () => Math.floor(Math.random() * 10)

    @SubscribeMessage('start')
    onStart(client: Socket, message: string): void { // WsResponse<string>
        console.log(`Starting: ${message}`);
        
        // client.broadcast.emit('chat', message + ' broadcast');
        // this.server.emit('chat', message + ' broadcast')
        
        client.emit('next-data', 0)
        // return { event: 'chat', data: 'Hello, World!' }
    }

    @SubscribeMessage('next-action')
    onNextResult(client: Socket, message: string): void { // WsResponse<string>
        console.log(`Next action: ${message}`);
        
        // client.broadcast.emit('chat', message + ' broadcast');
        // this.server.emit('chat', message + ' broadcast')
        
        const data = this.genData()

        if (data > 4)
            client.emit('next-data', data)
        else
            client.emit('end', 'End')
        // return { event: 'chat', data: 'Hello, World!' }
    }
}
