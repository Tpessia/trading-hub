import { Injectable, Scope } from "@nestjs/common";
import Dictionary from "src/common/models/Dictionary";
import IStockData from "src/data/models/common/IStockData";
import IStockResult from "src/data/models/common/IStockResult";
import IYahooData from "src/data/models/yahoo/IYahooData";
import { YahooInterval } from "src/data/models/yahoo/IYahooParams";
import { YahooService } from "src/data/services/yahoo.service";
import IClientResult from "../models/IClientResult";
import IClientState from "../models/IClientState";
import ITradingAction, { TradingActionType } from "../models/ITradingAction";
import ITradingData from "../models/ITradingData";
import ITradingStart from "../models/ITradingStart";
import { ITradingPortfolio } from "../models/ITradingStatus";
import StockMarket from "../models/StockMarket";

@Injectable({ scope: Scope.TRANSIENT })
export class TradingService<T extends IStockData = IYahooData> {
    constructor(private readonly yahooService: YahooService) { }

    private clientData: Dictionary<IClientState<T>> = {}

    private getClient(clientId: string): IClientState<T> | null {
        const clientData = this.clientData[clientId]
        return clientData
    }

    private setClient(clientId: string, data: IClientState<T>) {
        this.clientData[clientId] = data
    }

    deleteClient(clientId: string) {
        delete this.clientData[clientId]
    }

    async createClient(clientId: string, startMsg: ITradingStart) {
        this.setClient(clientId, {
            start: new Date(),
            initialBalance: startMsg.balance,
            initialData: {},
            currentData: undefined,
            orders: [],
            status: {
                progress: {
                    current: 0,
                    total: 0
                },
                portfolio: startMsg.tickers.reduce((acc, e) => ({ ...acc, [e]: { size: 0, avgCost: 0 } }), {} as Dictionary<ITradingPortfolio>),
                balance: startMsg.balance,
                net: startMsg.balance,
                profit: 0,
                var: 1
            }
        })

        const clientData = this.getClient(clientId)

        if (clientData) {
            clientData.initialData = await this.getInitialData(startMsg.tickers, startMsg.market, new Date(startMsg.start), new Date(startMsg.end))
            clientData.status.progress.total = Object.values(clientData.initialData)
                .reduce((acc, val) => acc + val.data.length, 0)
        }

    }

    async getInitialData(tickers: string[], market: StockMarket, start: Date, end: Date) {
        const requests: Promise<IStockResult<T>>[] = []

        tickers.forEach(ticker => {
            const request = this.yahooService.getHistorical(
                ticker,
                market,
                new Date(start),
                new Date(end),
                YahooInterval.Day1
            )

            requests.push(request as any)
        })

        const results = await Promise.all(requests)

        return tickers.reduce((acc, val, i) => ({ ...acc, [val]: results[i] }),
            {} as Dictionary<IStockResult<T>>)
    }

    getNextData(clientId: string): ITradingData<T> | null {
        const clientData = this.clientData[clientId]

        if (!clientData.initialData)
            throw new Error('Internal Error: No data available')

        clientData.status.progress.current++
        let nextTicker = this.getNextTicker(clientId)
        const nextData = clientData.initialData[nextTicker].data.shift() ?? null

        if (nextData === null)
            return null

        clientData.currentData = {
            ticker: nextTicker,
            data: nextData
        }

        return {
            data: clientData.currentData,
            status: clientData.status
        }
    }

    getNextTicker(clientId: string) {
        const clientData = this.clientData[clientId]

        let nextTicker: string
        if (clientData.currentData) {
            const keys = Object.keys(clientData.initialData)
            const currentIndex = keys.indexOf(clientData.currentData.ticker)

            if (currentIndex < 0)
                throw new Error('Internal Error: Inconsistent client data')

            const nextIndex = currentIndex + 1 >= keys.length ? 0 : currentIndex + 1

            nextTicker = Object.keys(this.clientData[clientId].initialData)[nextIndex]
        } else {
            nextTicker = Object.keys(this.clientData[clientId].initialData)[0]
        }

        return nextTicker
    }

    takeAction(clientId: string, action: ITradingAction) {
        const warnings: string[] = []

        const clientData = this.getClient(clientId)

        if (!clientData || !clientData.currentData)
            throw new Error('Internal Error: Unable to find current simulation data')

        const ticker = clientData?.currentData?.ticker
        const mktData = clientData?.currentData?.data
        const status = clientData.status
        const portfolio = status.portfolio
        const price = mktData.close

        const calcPosition = () => {
            const portfolioValue = Object.values(portfolio).reduce((acc, val) => acc + val.size * price, 0)
            status.net = status.balance + portfolioValue
            status.var = status.net / clientData.initialBalance
        }

        switch (action.type) {
            case TradingActionType.Buy:
                if (!action.size)
                    throw new Error('Invalid Operation: Buy order should have a size')

                const newBalance = status.balance - price * action.size

                if (newBalance < 0) {
                    warnings.push(`Invalid Operation: Operation would result in a negative balance (current: ${status.balance})`)
                    break
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
                if (!action.size)
                    throw new Error('Invalid Operation: Sell order should have a size')

                const newSize = portfolio[ticker].size - action.size
                const amount = action.size * price
                const profit = action.size * (price - portfolio[ticker].avgCost)

                if (newSize < 0) {
                    warnings.push(`Invalid Operation: Operation would result in a negative position (ticker: ${ticker}, current: ${portfolio[ticker].size})`)
                    break
                } else if (newSize === 0) {
                    portfolio[ticker].avgCost = 0
                }

                portfolio[ticker].size = newSize
                status.balance = status.balance + amount
                status.profit += profit

                clientData.orders.push({
                    action: action,
                    orderData: clientData.currentData,
                    orderResult: { profit }
                })

                break
        }

        calcPosition()

        return warnings
    }

    getClientResult(clientId: string): IClientResult<T> | null {
        const clientData = this.getClient(clientId)

        if (!clientData) return null

        return {
            initialBalance: clientData?.initialBalance,
            orders: clientData?.orders,
            status: clientData?.status
        }
    }
}
