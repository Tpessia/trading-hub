import StockMarket from "./StockMarket";

export default interface ITradingStart {
    tickers: string[],
    market: StockMarket,
    balance: number,
    start: string,
    end: string
}