import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../users/enums/user-roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'clave_secreta_ascas123123',
    description: 'Requerido solo para crear usuarios ADMIN',
    required: false,
  })
  @IsOptional()
  @IsString()
  adminSecret?: string;

  @ApiProperty({ enum: UserRole, isArray: true, required: false })
  @IsOptional()
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];
}
