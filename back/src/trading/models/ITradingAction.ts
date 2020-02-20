export default interface ITradingAction {
    type: TradingActionType,
    size: number
}

export enum TradingActionType {
    Buy = 'buy',
    Sell = 'sell',
    Null = 'null'
}