import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { SwapiService } from '../swapi/swapi.service';
import { NotFoundException } from '@nestjs/common';
import { SwapiFilmProperties } from '../swapi/interfaces/swapi-response.interface';

describe('MoviesService', () => {
  let service: MoviesService;
  let swapiService: SwapiService;
  let movieRepository: any;

  const mockMovieRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((movie) => Promise.resolve({ id: 'uuid', ...movie })),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  const mockSwapiService = {
    getAllFilms: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useValue: mockMovieRepository },
        { provide: SwapiService, useValue: mockSwapiService },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    swapiService = module.get<SwapiService>(SwapiService);
    movieRepository = module.get(getRepositoryToken(Movie));

    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar un array de películas', async () => {
      const result = [{ title: 'A New Hope' }];
      mockMovieRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('syncMovies', () => {
    it('debería crear películas nuevas y actualizar existentes', async () => {
      const swapiFilms: Partial<SwapiFilmProperties>[] = [
        {
          title: 'New Movie',
          episode_id: 1,
          release_date: '2025-01-01',
          url: 'url1',
        },
        {
          title: 'Existing Movie',
          episode_id: 2,
          release_date: '2025-01-01',
          url: 'url2',
        },
      ];

      mockSwapiService.getAllFilms.mockResolvedValue(swapiFilms);

      mockMovieRepository.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'existing-uuid',
          title: 'Old Title',
          episode_id: 2,
        });

      await service.syncMovies();

      expect(movieRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'New Movie' }),
      );
      expect(movieRepository.save).toHaveBeenCalled();

      expect(movieRepository.update).toHaveBeenCalledWith(
        'existing-uuid',
        expect.objectContaining({ title: 'Existing Movie' }),
      );
    });
  });

  describe('CRUD operations', () => {
    it('create debería llamar a repository.save', async () => {
      const dto = { title: 'Test Movie', release_date: '2024-01-01' };
      await service.create(dto as any);
      expect(movieRepository.save).toHaveBeenCalled();
    });

    it('findOne debería lanzar error si no existe', async () => {
      mockMovieRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('uuid')).rejects.toThrow(NotFoundException);
    });

    it('remove debería lanzar error si no afectó a ninguna fila', async () => {
      mockMovieRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('uuid')).rejects.toThrow(NotFoundException);
    });
  });
});
