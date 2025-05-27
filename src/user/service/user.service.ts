import { Provider } from '@nestjs/common';
import { CreateUserDto } from '../interface/create.interface';
import { UserEntity } from '../entity/user.entity';
import { UserServiceImpl } from './user.serviceImpl';

export interface UserService {
  create: (dto: CreateUserDto) => Promise<UserEntity>;
}

export const UserServiceToken = Symbol('UserService');
export const UserServiceProvider: Provider<UserService> = {
  provide: UserServiceToken,
  useClass: UserServiceImpl,
};
