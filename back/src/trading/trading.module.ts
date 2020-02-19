import { Module } from '@nestjs/common';
import { TradingGateway } from './gateways/trading.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [
    TradingGateway
  ],
})
export class TradingModule {}
