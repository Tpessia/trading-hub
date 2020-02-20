import Dictionary from "../../../../common/models/Dictionary";

export default interface IYahooApiResponseV8 {
    chart: {
        result: IYahooResult[],
        error: any
    }
}

interface IYahooResult {
    meta: {
        currency: string,
        symbol: string,
        exchangeName: string,
        instrumentType: string,
        firstTradeDate: number,
        regularMarketTime: number,
        gmtoffset: number,
        timezone: string,
        exchangeTimezoneName: string,
        regularMarketPrice: number,
        chartPreviousClose: number,
        priceHint: number,
        currentTradingPeriod: ICurrentTradingPeriod,
        dataGranularity: string,
        range: string,
        validRanges: string[],
    },
    timestamp: number[],
    events: {
        dividents: Dictionary<IDividend>
    },
    indicators: {
        quote: IQuote[],
        adjclose: {
            adjclose: number[]
        }[]
    }
}

interface ICurrentTradingPeriod {
    pre: ICurrentTradingPeriodValue,
    regular: ICurrentTradingPeriodValue,
    post: ICurrentTradingPeriodValue,
}

interface ICurrentTradingPeriodValue {
    timezone: string,
    start: number,
    end: number,
    gmtoffset: number
}

interface IDividend {
    amount: number,
    date: number
}

interface IQuote {
    volume: number[],
    open: number[],
    high: number[],
    low: number[],
    close: number[]
}