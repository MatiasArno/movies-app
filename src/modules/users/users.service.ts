import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from './enums/user-roles.enum';

interface DatabaseError extends Error {
  code?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, adminSecret, roles, ...userData } = createUserDto;

      if (roles && roles.includes(UserRole.ADMIN)) {
        const secretKey = this.configService.get<string>(
          'config.security.adminSecretKey',
        );

        if (!adminSecret || adminSecret !== secretKey) {
          throw new ForbiddenException(
            'Clave de administrador incorrecta o faltante',
          );
        }
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
        roles: roles || [UserRole.REGULAR],
      });

      await this.userRepository.save(user);

      delete (user as any).password;

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const dbError = error as DatabaseError;
      if (dbError.code === '23505') {
        throw new ConflictException('El email ya está registrado');
      }

      console.error(error);
      throw new InternalServerErrorException('Error al crear usuario');
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'roles'],
    });
  }
}
