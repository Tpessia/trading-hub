import IStockData from "../common/IStockData";

export default interface IAlphaData extends IStockData {
    dividendAmount: number,
    splitCoefficient: number
}