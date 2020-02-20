import Dictionary from "src/common/models/Dictionary";

export default interface ITradingStatus {
    balance: number,
    net: number,
    portfolio: Dictionary<ITradingPortfolio>
}

export interface ITradingPortfolio {
    size: number,
    avgCost: number
}