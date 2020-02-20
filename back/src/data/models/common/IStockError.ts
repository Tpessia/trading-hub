export default interface IStockError {
    type: StockErrorType,
    date: Date,
    message?: any
}

export enum StockErrorType {
    Missing = 'missing'
}