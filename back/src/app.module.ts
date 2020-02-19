import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DataModule } from './data/data.module';
import { TradingModule } from './trading/trading.module';

@Module({
  imports: [
    DataModule,
    TradingModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'front/build'),
    }),
  ],
})
export class AppModule {}
