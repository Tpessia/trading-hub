import Dictionary from "src/common/models/Dictionary";

export default interface ITradingStatus {
    progress: {
        current: number,
        total: number
    },
    portfolio: Dictionary<ITradingPortfolio>,
    balance: number,
    net: number,
    profit: number,
    var: number
}

export interface ITradingPortfolio {
    size: number,
    avgCost: number
}