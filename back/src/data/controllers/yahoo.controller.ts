import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { YahooIntervalV8 } from '../models/yahoo/v8/IYahooParamsV8';
import { YahooService } from '../services/yahoo.service';
import IStockResult from '../models/common/IStockResult';
import IYahooDataV8 from '../models/yahoo/v8/IYahooDataV8';

@Controller('yahoo')
export class YahooController {
  constructor(private readonly yahooService: YahooService) { }

  @Get('historical')
  @ApiQuery({ name: 'ticker', example: 'PETR4' })
  @ApiQuery({ name: 'start', example: '2019-01-01T00:00:00' })
  @ApiQuery({ name: 'end', example: '2020-01-01T00:00:00' })
  @ApiQuery({ name: 'interval', enum: YahooIntervalV8, schema: { default: YahooIntervalV8.Day1 } })
  async getHistorical(@Res() response: Response, @Query('ticker') ticker: string, @Query('start') start: string, @Query('end') end: string, @Query('interval') interval: YahooIntervalV8 = YahooIntervalV8.Day1): Promise<void> {
    const data = await this.yahooService.getHistoricalV8(ticker, new Date(start), new Date(end), interval)
    response.send(data)
  }
}
