import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { AlphaInterval } from 'src/data/models/alpha/AlphaConfig';
import { AlphaService } from 'src/data/services/alpha.service';
import IStockResult from '../models/common/IStockResult';
import IAlphaData from '../models/alpha/IAlphaData';
import StockMarket from 'src/trading/models/StockMarket';

@Controller('alpha')
export class AlphaController {
  constructor(private readonly alphaService: AlphaService) { }

  @Get('historical')
  @ApiQuery({ name: 'ticker', example: 'PETR4' })
  @ApiQuery({ name: 'market', enum: StockMarket, schema: { default: StockMarket.BR } })
  @ApiQuery({ name: 'start', example: '2019-01-01T00:00:00' })
  @ApiQuery({ name: 'end', example: '2020-01-01T00:00:00' })
  @ApiQuery({ name: 'interval', enum: AlphaInterval })
  async getHistorical(@Query('ticker') ticker: string, @Query('market') market: StockMarket = StockMarket.BR, @Query('start') start: string, @Query('end') end: string, @Query('interval') interval: AlphaInterval): Promise<IStockResult<IAlphaData>> {
    return this.alphaService.getHistorical(ticker, market, new Date(start), new Date(end), interval);
  }
}
