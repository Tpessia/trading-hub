import StockData from "../StockData";

export default interface YahooData extends StockData {
    
}

export interface YahooHistApiResponse {
    Date: string,
    Open: string,
    High: string,
    Low: string,
    Close: string,
    'Adj Close': string,
    Volume: string
}