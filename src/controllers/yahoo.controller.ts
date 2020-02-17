import { Controller, Get, Query } from '@nestjs/common';
import YahooData from '../models/yahoo/YahooData';
import { YahooService } from '../services/yahoo.service';
import { YahooInterval } from '../models/yahoo/YahooConfig';
import { ApiQuery } from '@nestjs/swagger';

@Controller('yahoo')
export class YahooController {
  constructor(private readonly yahooService: YahooService) { }

  @Get('historical')
  @ApiQuery({ name: 'ticker', example: 'PETR4' })
  @ApiQuery({ name: 'start', example: '2019-01-01T00:00:00' })
  @ApiQuery({ name: 'end', example: '2020-01-01T00:00:00' })
  @ApiQuery({ name: 'interval', enum: YahooInterval })
  async getHistorical(@Query('ticker') ticker: string, @Query('start') start: string, @Query('end') end: string, @Query('interval') interval: YahooInterval): Promise<YahooData[]> {
    return this.yahooService.getHistorical(ticker, new Date(start), new Date(end), interval);
  }
}
