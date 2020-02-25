import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { parse } from 'papaparse';
import axiosService from '../../common/services/axios.service';
import { getUnixTime, getUnixTimeGMT } from '../../common/utils/date.utils';
import IStockResult from '../models/common/IStockResult';
import IYahooHistApiResponseV7 from '../models/yahoo/v7/IYahooApiResponseV7';
import IYahooDataV7 from '../models/yahoo/v7/IYahooDataV7';
import IYahooParamsV7, { YahooEventV7, YahooIntervalV7 } from '../models/yahoo/v7/IYahooParamsV7';
import IYahooApiResponseV8 from '../models/yahoo/v8/IYahooApiResponseV8';
import IYahooDataV8 from '../models/yahoo/v8/IYahooDataV8';
import IYahooParamsV8, { YahooIntervalV8 } from '../models/yahoo/v8/IYahooParamsV8';
import { ValidatorService } from './validator.service';

@Injectable()
export class YahooService {
    constructor(private readonly validator: ValidatorService) { }

    getHistorical = this.getHistoricalV8

    //#region API V8

    // Inspired by: https://github.com/ranaroussi/yfinance/blob/master/yfinance/base.py
    async getHistoricalV8(ticker: string, start: Date, end: Date, interval: YahooIntervalV8): Promise<IStockResult<IYahooDataV8>> {
        this.validateRequestV8(ticker, start, end, interval)

        const params: IYahooParamsV8 = {
            interval,
            period1: getUnixTime(start),
            period2: getUnixTime(end),
            events: 'div,splits',
            includePrePost: true,
        }

        const apiResult = (await axiosService.get<IYahooApiResponseV8>(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.SA`, { params })).data

        const dataResult = this.mapHistDataV8(apiResult)

        const result = this.validator.validateResponse<IYahooDataV8>(dataResult)

        return result;
    }

    private validateRequestV8(ticker: string, start: Date, end: Date, interval: YahooIntervalV8): void {
        let dayRange = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

        if (interval === YahooIntervalV8.Min1 && dayRange > 7) {
            throw new HttpException('Invalid Interval: Maximum range for a 1 minute interval is 7 days.', HttpStatus.BAD_REQUEST)
        } else if (interval === YahooIntervalV8.Min2 && dayRange > 60) {
            throw new HttpException('Invalid Interval: Maximum range for a 2 minute interval is 60 days.', HttpStatus.BAD_REQUEST)
        } else if (interval === YahooIntervalV8.Min5 && dayRange > 60) {
            throw new HttpException('Invalid Interval: Maximum range for a 5 minute interval is 60 days.', HttpStatus.BAD_REQUEST)
        } else if (interval === YahooIntervalV8.Min15 && dayRange > 60) {
            throw new HttpException('Invalid Interval: Maximum range for a 15 minute interval is 60 days.', HttpStatus.BAD_REQUEST)
        } else if (interval === YahooIntervalV8.Min30 && dayRange > 60) {
            throw new HttpException('Invalid Interval: Maximum range for a 30 minute interval is 60 days.', HttpStatus.BAD_REQUEST)
        } else if (interval === YahooIntervalV8.Min90 && dayRange > 60) {
            throw new HttpException('Invalid Interval: Maximum range for a 90 minute interval is 60 days.', HttpStatus.BAD_REQUEST)
        }
    }

    private mapHistDataV8(data: IYahooApiResponseV8): IYahooDataV8[] {
        const newData: IYahooDataV8[] = []
        const result = data.chart.result[0]

        for (let i in result.timestamp) {
            const volume = result.indicators.quote[0].volume[i]
            const open = result.indicators.quote[0].open[i]
            const high = result.indicators.quote[0].high[i]
            const low = result.indicators.quote[0].low[i]
            const close = result.indicators.quote[0].close[i]
            const adjClose = result.indicators.adjclose[0].adjclose[i]

            const ratio = adjClose / close

            const timeData: IYahooDataV8 = {
                Date: new Date(result.timestamp[i] * 1000),
                Volume: volume,
                Open: open,
                High: high,
                Low: low,
                Close: close,
                AdjOpen: open * ratio,
                AdjHigh: high * ratio,
                AdjLow: low * ratio,
                AdjClose: adjClose
            }

            newData.push(timeData)
        }

        return newData
    }

    //#endregion

    //#region API V7

    // Inspired by: https://github.com/AndrewRPorter/yahoo-historical/blob/master/yahoo_historical/fetch.py
    async getHistoricalV7(ticker: string, start: Date, end: Date, interval: YahooIntervalV7): Promise<IStockResult<IYahooDataV7>> {
        const authResult = (await axiosService.get<string>(`https://finance.yahoo.com/quote/${ticker}.SA/history`))
        const cookie: string | null = authResult.headers['set-cookie']?.[0]?.match(/B=(.*?);/)?.[1]
        const crumb = authResult.data.match(/"CrumbStore":\{"crumb":"(.*?)"\}/)?.[1]?.replace('\\u002F', '/')

        if (!cookie || !crumb)
            throw new Error('Failed to obtain cookie and/or crumb')

        const params: IYahooParamsV7 = {
            interval,
            crumb,
            type: YahooEventV7.History,
            period1: getUnixTimeGMT(start),
            period2: getUnixTimeGMT(end)
        }

        const apiResult = (await axiosService.get<string>(`https://query1.finance.yahoo.com/v7/finance/download/${ticker}.SA`, {
            params,
            headers: { Cookie: `B=${cookie};` }
        })).data

        const parseResult: IYahooHistApiResponseV7[] = parse(apiResult, {
            delimiter: ',',
            header: true
        }).data

        const dataResult = parseResult.map(this.mapHistDataV7)

        const result = this.validator.validateResponse<IYahooDataV7>(dataResult)

        return result
    }

    private mapHistDataV7(data: IYahooHistApiResponseV7): IYahooDataV7 {
        const volume = +data.Volume
        const open = +data.Open
        const high = +data.High
        const low = +data.Low
        const close = +data.Close
        const adjClose = +data['Adj Close']

        const ratio = adjClose / close

        return {
            Date: new Date(`${data.Date}T00:00:00`),
            Volume: volume,
            Open: open,
            High: high,
            Low: low,
            Close: close,
            AdjOpen: open * ratio,
            AdjHigh: high * ratio,
            AdjLow: low * ratio,
            AdjClose: adjClose
        }
    }

    //#endregion
}
