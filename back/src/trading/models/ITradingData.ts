import IStockData from "src/data/models/common/IStockData";
import IStockDataInstance from "./IStockDataInstance";
import ITradingStatus from "./ITradingStatus";

export default interface ITradingData<T extends IStockData> {
    data: IStockDataInstance<T>,
    status: ITradingStatus
}