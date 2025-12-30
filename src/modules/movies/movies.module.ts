import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { SwapiModule } from '../swapi/swapi.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), SwapiModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
