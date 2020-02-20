import IStockData from "./IStockData";
import ITradingOrder from "./ITradingOrder";
import ITradingStatus from "./ITradingStatus.";


export default interface IClientResult<T extends IStockData> {
    initialBalance: number,
    orders: ITradingOrder<T>[],
    status: ITradingStatus
}