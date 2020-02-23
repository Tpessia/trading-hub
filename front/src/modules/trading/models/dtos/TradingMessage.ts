export enum TradingInputMessage {
    Data = 'data',
    Error = 'error',
    Warning = 'warning',
    Result = 'result',
    End = 'end'
}

export enum TradingOutputMessage {
    Start = 'start',
    Action = 'action',
    Stop = 'stop'
}