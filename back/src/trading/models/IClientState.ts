import Dictionary from "src/common/models/Dictionary";
import IStockData from "src/data/models/common/IStockData";
import IStockResult from "src/data/models/common/IStockResult";
import ITradingOrder from "./ITradingOrder";
import ITradingStatus from "./ITradingStatus";
import IStockDataInstance from "./IStockDataInstance";

export default interface IClientState<T extends IStockData> {
    start: Date,
    initialBalance: number,
    initialData: Dictionary<IStockResult<T>>,
    currentData?: IStockDataInstance<T>,
    orders: ITradingOrder<T>[],
    status: ITradingStatus
}