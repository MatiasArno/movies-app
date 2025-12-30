import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-roles.enum';

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post('sync')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Sincronizar películas desde SWAPI' })
  @ApiResponse({
    status: 201,
    description: 'Sincronización iniciada correctamente',
  })
  @ApiResponse({ status: 403, description: 'Forbidden: Requiere rol Admin' })
  sync() {
    return this.moviesService.syncMovies();
  }

  @Get()
  @Roles(UserRole.REGULAR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todas las películas' })
  findAll() {
    return this.moviesService.findAll();
  }
}
