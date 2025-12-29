import { Module } from '@nestjs/common';
import { SwapiService } from './swapi.service';

@Module({
  providers: [SwapiService],
})
export class SwapiModule {}
