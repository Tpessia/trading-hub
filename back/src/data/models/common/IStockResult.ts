import IStockData from "./IStockData";
import IStockError from "./IStockError";

export default interface IStockResult<T extends IStockData> {
    data: T[],
    errors: IStockError[]
}