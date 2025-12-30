import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { SwapiService } from '../swapi/swapi.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

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

  async findAll(): Promise<Movie[]> {
    return this.movieRepository.find({
      order: {
        episode_id: 'ASC',
        release_date: 'ASC',
      },
    });
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      const movie = this.movieRepository.create(createMovieDto);
      return await this.movieRepository.save(movie);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        'Error al crear la película. Verifique los datos.',
      );
    }
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieRepository.findOneBy({ id });
    if (!movie)
      throw new NotFoundException(`Película con ID ${id} no encontrada`);

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.movieRepository.preload({
      id: id,
      ...updateMovieDto,
    });

    if (!movie)
      throw new NotFoundException(`Película con ID ${id} no encontrada`);

    return this.movieRepository.save(movie);
  }

  async remove(id: string): Promise<void> {
    const result = await this.movieRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Película con ID ${id} no encontrada`);
    }
  }
}
