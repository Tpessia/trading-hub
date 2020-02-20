import IStockData from "./IStockData";

export default interface IStockDataInstance<T extends IStockData> {
    ticker: string,
    data: T
}