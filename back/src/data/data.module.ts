import { Module } from '@nestjs/common';
import { AlphaController } from './controllers/alpha.controller';
import { YahooController } from './controllers/yahoo.controller';
import { AlphaService } from './services/alpha.service';
import { YahooService } from './services/yahoo.service';
import { ValidatorService } from './services/validator.service';

@Module({
  imports: [],
  controllers: [
    YahooController,
    AlphaController
  ],
  providers: [
    YahooService,
    AlphaService,
    ValidatorService
  ],
  exports: [
    YahooService,
    AlphaService,
  ]
})
export class DataModule {}
