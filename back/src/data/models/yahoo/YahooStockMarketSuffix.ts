import { StrictEnumDictionary } from "src/common/models/Dictionary";
import StockMarket from "src/trading/models/StockMarket";

const YahooStockMarketSuffix: StrictEnumDictionary<StockMarket, string> = {
    [StockMarket.BR]: '.SA',
    [StockMarket.USA]: ''
}

export default YahooStockMarketSuffix;