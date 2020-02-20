import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DataModule } from './data/data.module';
import { TradingModule } from './trading/trading.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '../..', 'front/build'),
      rootPath: join(__dirname, 'static'),
    }),
    DataModule,
    TradingModule,
    CommonModule,
  ],
})
export class AppModule {}
