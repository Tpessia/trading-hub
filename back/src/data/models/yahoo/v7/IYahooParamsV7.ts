export default interface IYahooParamsV7 {
    crumb: string,
    type: YahooEventV7,
    period1: number,
    period2: number,
    interval: YahooIntervalV7
}

export enum YahooEventV7 {
    History = 'history',
    Dividend = 'div',
    Split = 'split'
}

export enum YahooIntervalV7 {
    Day = '1d',
    Week = '1wk',
    Month = '1mo'
}