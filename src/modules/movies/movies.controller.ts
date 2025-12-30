import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
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
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // --- ADMIN --- //

  @Post('sync')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Sincronizar con API externa (Admin)' })
  sync() {
    return this.moviesService.syncMovies();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear nueva película manualmente (Admin)' })
  @ApiResponse({ status: 201, description: 'Creada exitosamente' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar película (Admin)' })
  @ApiResponse({ status: 200, description: 'Actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar película (Admin)' })
  @ApiResponse({ status: 200, description: 'Eliminada exitosamente' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.remove(id);
  }

  // --- REGULAR --- //

  @Get(':id')
  @Roles(UserRole.REGULAR)
  @ApiOperation({ summary: 'Ver detalles de una película' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.findOne(id);
  }

  // --- PUBLIC --- //

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todas las películas' })
  findAll() {
    return this.moviesService.findAll();
  }
}
