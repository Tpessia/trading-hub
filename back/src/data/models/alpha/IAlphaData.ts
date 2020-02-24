import IStockData from "../common/IStockData";

export default interface IAlphaData extends IStockData {
    DividendAmount: number,
    SplitCoefficient: number
}