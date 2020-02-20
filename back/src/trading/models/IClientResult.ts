import IStockData from "src/data/models/common/IStockData";
import ITradingOrder from "./ITradingOrder";
import ITradingStatus from "./ITradingStatus";

export default interface IClientResult<T extends IStockData> {
    initialBalance: number,
    orders: ITradingOrder<T>[],
    status: ITradingStatus
}