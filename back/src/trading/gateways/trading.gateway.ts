import { Logger, UseFilters } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsExceptionsFilter } from 'src/common/filters/ws-exception.filter';
import Dictionary from 'src/common/models/Dictionary';
import IStockResult from 'src/data/models/common/IStockResult';
import IYahooDataV8 from 'src/data/models/yahoo/v8/IYahooDataV8';
import { YahooIntervalV8 } from 'src/data/models/yahoo/v8/IYahooParamsV8';
import { YahooService } from 'src/data/services/yahoo.service';
import IClientState from '../models/IClientState';
import IStockDataInstance from '../models/IStockDataInstance';
import ITradingAction, { TradingActionType } from '../models/ITradingAction';
import ITradingData from '../models/ITradingData';
import { ITradingPortfolio } from '../models/ITradingStatus';
import ITradingStart from '../models/ITradingStart';
import IClientResult from '../models/IClientResult';

@WebSocketGateway({ namespace: 'trading' })
export class TradingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly yahooService: YahooService) { }

    @WebSocketServer() server: Server;

    clientData: Dictionary<IClientState<IYahooDataV8>> = {}

    sendWarning(client: Socket, info: string) {
        Logger.warn(`Warning: ${info}`, TradingGateway.name)
        client.emit('warning', info)
    }

    sendError(client: Socket, e: Error) {
        const message = 'message' in e ? e.message : e
        Logger.error(`Error: ${message}`, e.stack, TradingGateway.name)
        client.emit('error', e)
    }

    getNextData(client: Socket): IStockDataInstance<IYahooDataV8> {
        const currentData = this.clientData[client.id].currentData;

        if (!this.clientData[client.id].initialData)
            this.sendError(client, new Error('No data available'))

        let nextTicker: string

        if (currentData) {
            const keys = Object.keys(this.clientData[client.id].initialData)
            const currentIndex = keys.indexOf(currentData.ticker)

            if (currentIndex < 0)
                this.sendError(client, new Error('Internal Error: Inconsistent client data'))

            const nextIndex = currentIndex + 1 >= keys.length ? 0 : currentIndex + 1

            nextTicker = Object.keys(this.clientData[client.id].initialData)[nextIndex]
        } else {
            nextTicker = Object.keys(this.clientData[client.id].initialData)[0]
        }

        const nextData = this.clientData[client.id].initialData[nextTicker].data.shift() ?? null

        return {
            ticker: nextTicker,
            data: nextData
        }
    }

    sendNextData(client: Socket, ticker: string, data: IYahooDataV8) {
        const clientData = this.clientData[client.id]

        clientData.currentData = { ticker, data }

        client.emit('data', {
            data,
            status: clientData.status
        } as ITradingData<IYahooDataV8>)
    }

    takeAction(client: Socket, action: ITradingAction) {
        const clientData = this.clientData[client.id]
        const ticker = clientData.currentData.ticker
        const mktData = clientData.currentData.data
        const status = clientData.status
        const portfolio = status.portfolio
        const price = mktData.Close

        switch (action.type) {
            case TradingActionType.Buy:
                const newBalance = status.balance - price * action.size

                if (newBalance < 0) {
                    this.sendWarning(client, `Invalid Operation: Operation would result in a negative balance (current: ${status.balance})`)
                    return
                }

                status.balance = newBalance

                portfolio[ticker] = {
                    size: portfolio[ticker].size + action.size,
                    avgCost: (portfolio[ticker].size * portfolio[ticker].avgCost + action.size * price) / (portfolio[ticker].size + action.size)
                }

                clientData.orders.push({
                    action: action,
                    orderData: clientData.currentData
                })

                break
            case TradingActionType.Sell:
                const newSize = portfolio[ticker].size - action.size
                const amount = action.size * price
                const profit = action.size * (price - portfolio[ticker].avgCost)

                if (newSize < 0) {
                    this.sendWarning(client, `Invalid Operation: Operation would result in a negative position (ticker: ${ticker}, current: ${portfolio[ticker].size})`)
                    return
                } else if (newSize === 0) {
                    portfolio[ticker].avgCost = 0
                }

                portfolio[ticker].size = newSize
                status.balance = status.balance + amount

                clientData.orders.push({
                    action: action,
                    orderData: clientData.currentData,
                    orderResult: { profit }
                })

                break
        }

        const portfolioValue = Object.values(portfolio).reduce((acc,val) => acc + val.size * price, 0)
        status.net = status.balance + portfolioValue
    }

    //#region Lifecycle

    handleConnection(client: Socket) {
        Logger.log(`Client Connected: ${client.id}`, TradingGateway.name)
    }

    handleDisconnect(client: Socket) {
        Logger.log(`Client Disconnected: ${client.id}`, TradingGateway.name)
        delete this.clientData[client.id]
    }

    //#endregion

    //#region Events

    @UseFilters(new WsExceptionsFilter())
    @SubscribeMessage('start')
    async onStart(client: Socket, message: ITradingStart): Promise<void> {
        Logger.log(`Starting: ${client.id}\n@ ${JSON.stringify(message)}`, TradingGateway.name);

        this.clientData[client.id] = {
            initialBalance: message.balance,
            initialData: {},
            currentData: null,
            orders: [],
            status: {
                balance: message.balance,
                net: message.balance,
                portfolio: message.tickers.reduce((acc, e) => ({ ...acc, [e]: { size: 0, avgCost: 0 } }), {} as Dictionary<ITradingPortfolio>)
            }
        }

        const clientData = this.clientData[client.id]

        try {
            const requests: Promise<IStockResult<IYahooDataV8>>[] = []

            message.tickers.forEach(ticker => {
                const request = this.yahooService.getHistoricalV8(
                    ticker,
                    new Date(message.start),
                    new Date(message.end),
                    YahooIntervalV8.Day1
                )

                requests.push(request)
            })

            const results = await Promise.all(requests)
            results.forEach((e, i) => clientData.initialData[message.tickers[i]] = e)

            const nextData = this.getNextData(client)
            this.sendNextData(client, nextData.ticker, nextData.data)
        } catch (e) {
            this.sendError(client, e)
        }
    }

    @UseFilters(new WsExceptionsFilter())
    @SubscribeMessage('action')
    onNextResult(client: Socket, message: ITradingAction): void {
        this.takeAction(client, message)

        const clientData = this.clientData[client.id]
        const nextData = this.getNextData(client)

        if (nextData.data) {
            this.sendNextData(client, nextData.ticker, nextData.data)
        } else {
            Logger.log(`Ending: ${client.id}`, TradingGateway.name)

            client.emit('end', {
                initialBalance: clientData.initialBalance,
                orders: clientData.orders,
                status: clientData.status
            } as IClientResult<IYahooDataV8>)

            delete this.clientData[client.id]
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