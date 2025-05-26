import { Provider } from '@nestjs/common';
import { UserEntity } from '../../../user/entity/user.entity';
import { AuthServiceImpl } from './auth.serviceImpl';
import { CreateUserDto } from '../../../user/interface/create.interface';

export interface AuthService {
  signUp: (dto: CreateUserDto) => Promise<UserEntity>;
}

export const AuthServiceToken = Symbol('AuthService');
export const AuthServiceProvider: Provider<AuthService> = {
  provide: AuthServiceToken,
  useClass: AuthServiceImpl,
};
