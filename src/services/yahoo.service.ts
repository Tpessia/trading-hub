import { Injectable } from '@nestjs/common';
import { parse } from 'papaparse';
import axiosService from './axios.service';
import { StrictEnumDictionary } from '../models/Dictionary';
import { YahooEvent, YahooInterval } from '../models/yahoo/YahooConfig';
import YahooData, { YahooHistApiResponse } from '../models/yahoo/YahooData';
import { getTimeGMT } from '../utils/date.utils';

@Injectable()
export class YahooService {
    private readonly mapDict: StrictEnumDictionary<YahooEvent, (data: YahooHistApiResponse) => any> = { // TODO: any para YahooData | ...
        [YahooEvent.History]: this.mapHistData,
        [YahooEvent.Dividend]: data => data,
        [YahooEvent.Split]: data => data
    }

    getHistorical = async (ticker: string, start: Date, end: Date, interval: YahooInterval): Promise<YahooData[]> =>
        this.getData(YahooEvent.History, ticker, start, end, interval);

    private async getData(type: YahooEvent, ticker: string, start: Date, end: Date, interval: YahooInterval): Promise<any[]> {
        const authResult = (await axiosService.get<string>(`https://finance.yahoo.com/quote/${ticker}.SA/history`));
        const cookie = authResult.headers['set-cookie'][0].match(/B=(.*?);/)[1];
        const crumb = authResult.data.match(/"CrumbStore":\{"crumb":"(.*?)"\}/)[1].replace('\\u002F', '/');

        console.log(start, getTimeGMT(start))

        const dataResult = (await axiosService.get<string>(`https://query1.finance.yahoo.com/v7/finance/download/${ticker}.SA?events=${type}&period1=${getTimeGMT(start)}&period2=${getTimeGMT(end)}&interval=${interval}&crumb=${crumb}`, {
            headers: {
                Cookie: `B=${cookie};`
            }
        })).data;

        const responseData: YahooHistApiResponse[] = parse(dataResult, {
            delimiter: ',',
            header: true
        }).data;

        return responseData.map(this.mapDict[type]);
    }

    private mapHistData(data: YahooHistApiResponse): YahooData {
        return {
            Date: new Date(`${data.Date}T00:00:00`),
            Open: +data.Open,
            High: +data.High,
            Low: +data.Low,
            Close: +data.Close,
            AdjClose: +data['Adj Close'],
            Volume: +data.Volume
        }
    }
}
