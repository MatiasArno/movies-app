import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { SwapiService } from '../swapi/swapi.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly swapiService: SwapiService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES) // PARA PROBAR
  async syncMovies() {
    this.logger.log('🔄 Iniciando sincronización con SWAPI...');

    try {
      const films = await this.swapiService.getAllFilms();

      for (const film of films) {
        const existingMovie = await this.movieRepository.findOneBy({
          episode_id: film.episode_id,
        });

        if (existingMovie) {
          await this.movieRepository.update(existingMovie.id, {
            title: film.title,
            director: film.director,
            producer: film.producer,
            release_date: new Date(film.release_date),
            opening_crawl: film.opening_crawl,
            url: film.url,
          });
        } else {
          const newMovie = this.movieRepository.create({
            title: film.title,
            episode_id: film.episode_id,
            director: film.director,
            producer: film.producer,
            release_date: new Date(film.release_date),
            opening_crawl: film.opening_crawl,
            url: film.url,
          });
          await this.movieRepository.save(newMovie);
        }
      }

      this.logger.log(
        `✅ Sincronización completada. ${films.length} películas procesadas.`,
      );
      return { message: 'Sincronización completada', count: films.length };
    } catch (error) {
      this.logger.error('❌ Error en la sincronización', error);
    }
  }

  async findAll() {
    return this.movieRepository.find({ order: { episode_id: 'ASC' } });
  }
}
