import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-roles.enum';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      META_ROLES,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    if (!user) throw new ForbiddenException('Usuario no identificado');

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    if (!hasRole)
      throw new ForbiddenException(
        `Se requiere rol: ${requiredRoles.join(', ')}`,
      );

    return true;
  }
}
