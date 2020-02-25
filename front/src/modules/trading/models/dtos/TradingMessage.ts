export enum TradingInputMessage {
    Data = 'data',
    Error = 'fail',
    Warning = 'warning',
    Result = 'result',
    End = 'end'
}

export enum TradingOutputMessage {
    Start = 'start',
    Action = 'action',
    Stop = 'stop'
}