export default interface IYahooParamsV8 {
    interval: YahooIntervalV8,
    period?: YahooPeriodV8,
    period1?: number,
    period2?: number,
    includePrePost: boolean // Include Pre and Post market data
    events: 'div,splits'
}

export enum YahooPeriodV8 {
    Day1 = '1d',
    Day5 = '5d',
    Mon1 = '1mo',
    Mon3 = '3mo',
    Mon6 = '6mo',
    Year1 = '1y',
    Year2 = '2y',
    Year5 = '5y',
    Year10 = '10y',
    Ytd = 'ytd',
    Max = 'max'
}

export enum YahooIntervalV8 {
    Min1 = '1m',
    Min2 = '2m',
    Min5 = '5m',
    Min15 = '15m',
    Min30 = '30m',
    Min60 = '60m',
    Min90 = '90m',
    Hour1 = '1h',
    Day1 = '1d',
    Day5 = '5d',
    Week1 = '1wk',
    Mon1 = '1mo',
    Mon3 = '3mo'
}