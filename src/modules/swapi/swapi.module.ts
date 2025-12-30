import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SwapiService } from './swapi.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    ConfigModule,
  ],
  providers: [SwapiService],
  exports: [SwapiService],
})
export class SwapiModule {}
