import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 'Rogue One: A Star Wars Story' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 7,
    description: 'Número de episodio (opcional)',
    required: false,
  })
  @IsInt()
  @IsOptional()
  episode_id?: number;

  @ApiProperty({ example: 'A long time ago in a galaxy far, far away...' })
  @IsString()
  @IsOptional()
  opening_crawl?: string;

  @ApiProperty({ example: 'Gareth Edwards' })
  @IsString()
  @IsOptional()
  director?: string;

  @ApiProperty({ example: 'Kathleen Kennedy' })
  @IsString()
  @IsOptional()
  producer?: string;

  @ApiProperty({ example: '2016-12-16' })
  @IsDateString()
  release_date: string;

  @ApiProperty({ example: 'https://swapi.tech/api/films/1', required: false })
  @IsUrl()
  @IsOptional()
  url?: string;
}
