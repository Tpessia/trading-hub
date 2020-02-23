import IYahooParamsV8, { YahooPeriodV8, YahooIntervalV8 } from "./v8/IYahooParamsV8";

export default interface IYahooParams extends IYahooParamsV8 {
    
}

export type YahooPeriod = YahooPeriodV8;
export const YahooPeriod = {...YahooPeriodV8}

export type YahooInterval = YahooIntervalV8;
export const YahooInterval = {...YahooIntervalV8}