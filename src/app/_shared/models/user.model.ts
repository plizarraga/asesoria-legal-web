import { IRole } from './role.model';

export interface IUser {
  id: number;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: IRole;
  jwtToken?: string;
}
