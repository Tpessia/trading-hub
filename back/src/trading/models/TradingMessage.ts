export enum TradingInputMessage {
    Start = 'start',
    Action = 'action',
    Stop = 'stop'
}

export enum TradingOutputMessage {
    Data = 'data',
    Error = 'fail',
    Warning = 'warning',
    Result = 'result',
    End = 'end'
}