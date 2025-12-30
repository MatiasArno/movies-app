import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMoviesService = {
    create: jest.fn((dto) => ({ id: '1', ...dto })),
    findAll: jest.fn(() => []),
    findOne: jest.fn((id) => ({ id, title: 'Test' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn((id) => ({ deleted: true })),
    syncMovies: jest.fn(() => ({ message: 'Sync complete' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: mockMoviesService }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create debería llamar al servicio', async () => {
    const dto: CreateMovieDto = { title: 'Test', release_date: '2024-01-01' };
    expect(await controller.create(dto)).toEqual({ id: '1', ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('sync debería llamar a syncMovies', async () => {
    await controller.sync();
    expect(service.syncMovies).toHaveBeenCalled();
  });

  it('findAll debería retornar array', async () => {
    expect(await controller.findAll()).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });
});
