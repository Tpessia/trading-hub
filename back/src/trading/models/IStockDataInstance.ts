import IStockData from "src/data/models/common/IStockData";

export default interface IStockDataInstance<T extends IStockData> {
    ticker: string,
    data: T
}