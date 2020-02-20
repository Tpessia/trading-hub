import IStockData from "./IStockData";
import IStockDataInstance from "./IStockDataInstance";
import ITradingStatus from "./ITradingStatus.";

export default interface ITradingData<T extends IStockData> {
    data: IStockDataInstance<T>,
    status: ITradingStatus
}