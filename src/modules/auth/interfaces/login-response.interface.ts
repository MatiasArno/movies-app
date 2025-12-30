import { UserRole } from '../../users/enums/user-roles.enum';

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    roles: UserRole[];
  };
}
