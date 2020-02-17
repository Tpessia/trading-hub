import { Injectable } from '@nestjs/common';
import { AlphaInterval } from 'src/models/alpha/AlphaConfig';
import AlphaData, { AlphaApiData, AlphaApiResponse } from 'src/models/alpha/AlphaData';
import axiosService from './axios.service';

@Injectable()
export class AlphaService {
    private readonly apiKey = 'WU8VTI1IRD58LFV5';

    getHistorical = async (ticker: string, start: Date, end: Date, interval: AlphaInterval): Promise<AlphaData[]> => {
        let result = (await axiosService.get<AlphaApiResponse>(`https://www.alphavantage.co/query?apikey=${this.apiKey}&function=${AlphaInterval.Daily}&symbol=${ticker}.SAO&datatype=json&outputsize=full`)).data;
        return Object.entries(result['Time Series (Daily)']).map(e => this.mapHistData(e[0], e[1]));
    }

    private mapHistData(date: string, data: AlphaApiData): AlphaData {
        return {
            Date: new Date(`${date}T00:00:00`),
            Open: +data['1. open'],
            High: +data['2. high'],
            Low: +data['3. low'],
            Close: +data['4. close'],
            AdjClose: +data['5. adjusted close'],
            Volume: +data['6. volume'],
            DividendAmount: +data['7. dividend amount'],
            SplitCoefficient: +data['8. split coefficient']
        }
    }
}
