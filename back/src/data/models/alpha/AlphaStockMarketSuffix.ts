import { StrictEnumDictionary } from "src/common/models/Dictionary";
import StockMarket from "src/trading/models/StockMarket";

const AlphaStockMarketSuffix: StrictEnumDictionary<StockMarket, string> = {
    [StockMarket.BR]: '.SAO',
    [StockMarket.USA]: ''
}

export default AlphaStockMarketSuffix;