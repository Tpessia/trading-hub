import IStockData from "./IStockData";
import IStockDataInstance from "./IStockDataInstance";
import ITradingAction from "./ITradingAction";

export default interface ITradingOrder<T extends IStockData> {
    action: ITradingAction,
    orderData: IStockDataInstance<T>,
    orderResult?: ITradingOrderResult
}

export interface ITradingOrderResult {
    profit: number
}