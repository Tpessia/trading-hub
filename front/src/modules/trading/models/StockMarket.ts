import { StrictEnumDictionary } from "../../common/models/Dictionary";

enum StockMarket {
    BR = 'br',
    USA = 'usa'
}

export const StockMarketNames: StrictEnumDictionary<StockMarket, string> = {
    [StockMarket.BR]: 'BR',
    [StockMarket.USA]: 'USA'
}

export default StockMarket;