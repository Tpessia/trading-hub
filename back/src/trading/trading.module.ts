import { Module } from '@nestjs/common';
import { TradingGateway } from './gateways/trading.gateway';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [DataModule],
  controllers: [],
  providers: [
    TradingGateway
  ],
})
export class TradingModule {}
