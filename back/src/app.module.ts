import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DataModule } from './data/data.module';
import { TradingModule } from './trading/trading.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
      // The current config means: cache the files, but with every request ask the server if anything has changed, and if not, use cache
      serveStaticOptions: { 
        cacheControl: true,
        /**
         * Enable or disable Last-Modified header, defaults to true. Uses the file system's last modified value.
         */
        lastModified: true,
        /**
         * Provide a max-age in milliseconds for http caching, defaults to 0.
         * This can also be a string accepted by the ms module.
         */
        maxAge: 0
      }
    }),
    DataModule,
    TradingModule,
    CommonModule,
  ],
})
export class AppModule {}
