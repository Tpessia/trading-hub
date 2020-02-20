import IStockData from "src/data/models/common/IStockData";
import ITradingAction from "./ITradingAction";
import IStockDataInstance from "./IStockDataInstance";

export default interface ITradingOrder<T extends IStockData> {
    action: ITradingAction,
    orderData: IStockDataInstance<T>,
    orderResult?: ITradingOrderResult
}

export interface ITradingOrderResult {
    profit: number
}