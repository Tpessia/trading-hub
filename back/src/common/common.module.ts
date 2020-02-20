import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import AllExceptionsFilter from './filters/exception.filter';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class CommonModule {}
