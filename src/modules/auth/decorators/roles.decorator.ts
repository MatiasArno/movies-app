import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-roles.enum';

export const META_ROLES = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(META_ROLES, roles);
