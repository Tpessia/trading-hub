import { Module } from '@nestjs/common';
import { DataModule } from 'src/data/data.module';
import { TradingGateway } from './gateways/trading.gateway';
import { TradingService } from './services/trading.service';

@Module({
  imports: [DataModule],
  controllers: [],
  providers: [
    TradingGateway,
    TradingService
  ],
})
export class TradingModule {}
