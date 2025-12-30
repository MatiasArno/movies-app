import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';
import {
  SwapiResponse,
  SwapiFilmItem,
  SwapiFilmProperties,
} from './interfaces/swapi-response.interface';

@Injectable()
export class SwapiService {
  private readonly logger = new Logger(SwapiService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>('config.swapi.url');
  }

  async getAllFilms(): Promise<SwapiFilmProperties[]> {
    const url = `${this.baseUrl}/films`;

    const { data } = await firstValueFrom(
      this.httpService.get<SwapiResponse<SwapiFilmItem[]>>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error('Error al conectar con SWAPI', error.message);
          throw new InternalServerErrorException(
            'No se pudo conectar con el proveedor de películas',
          );
        }),
      ),
    );

    return data.result.map((item) => item.properties);
  }
}
