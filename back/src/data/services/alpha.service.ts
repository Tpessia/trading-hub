import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { AlphaInterval } from 'src/data/models/alpha/AlphaConfig';
import IAlphaData from 'src/data/models/alpha/IAlphaData';
import StockMarket from 'src/trading/models/StockMarket';
import axiosService from '../../common/services/axios.service';
import AlphaStockMarketSuffix from '../models/alpha/AlphaStockMarketSuffix';
import IAlphaApiResponse, { IAlphaApiData } from '../models/alpha/IAlphaApiResponse';
import IStockResult from '../models/common/IStockResult';
import { ValidatorService } from './validator.service';

@Injectable()
export class AlphaService {
    constructor(private readonly validator: ValidatorService) { }

    private readonly apiKey = 'WU8VTI1IRD58LFV5';

    getHistorical = async (ticker: string, market: StockMarket, start: Date, end: Date, interval: AlphaInterval): Promise<IStockResult<IAlphaData>> => {
        const suffix = AlphaStockMarketSuffix[market]

        const apiResult = (await axiosService.get<IAlphaApiResponse>(`https://www.alphavantage.co/query?apikey=${this.apiKey}&function=${AlphaInterval.Daily}&symbol=${ticker}${suffix}&datatype=json&outputsize=full`)).data

        const filterResult = this.filterDate(apiResult, start, end)

        const dataResult = Object.entries(filterResult['Time Series (Daily)']).map(e => this.mapHistData(e[0], e[1]))

        const result = this.validator.validateResponse<IAlphaData>(dataResult)

        return result
    }

    private filterDate(apiResult: IAlphaApiResponse, start: Date, end: Date): IAlphaApiResponse {
        const include = Object.entries(apiResult['Time Series (Daily)']).map(e => {
            const date = new Date(`${e[0]}T00:00:00`)

            if (date.getTime() >= start.getTime() && date.getTime() <= end.getTime())
                return e[0]

            return null
        })
            .filter(e => e !== null)
            .reverse() as string[]

        return {
            ...apiResult,
            'Time Series (Daily)': pick(apiResult['Time Series (Daily)'], include)
        }
    }

    private mapHistData(dateStr: string, data: IAlphaApiData): IAlphaData {
        const volume = +data['6. volume']
        const open = +data['1. open']
        const high = +data['2. high']
        const low = +data['3. low']
        const close = +data['4. close']
        const adjClose = +data['5. adjusted close']
        const dividendAmount = +data['7. dividend amount']
        const splitCoefficient = +data['8. split coefficient']

        const ratio = adjClose / close

        return {
            Date: new Date(`${dateStr}T00:00:00Z`),
            Volume: volume,
            Open: open,
            High: high,
            Low: low,
            Close: close,
            AdjOpen: open * ratio,
            AdjHigh: high * ratio,
            AdjLow: low * ratio,
            AdjClose: adjClose,
            DividendAmount: dividendAmount,
            SplitCoefficient: splitCoefficient
        }
    }
}
