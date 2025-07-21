import { Injectable } from '@nestjs/common';
import { PersistedUserEntity, UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEmailVO } from '../vo/email.vo';
import { UserService } from './user.service';
import { UserRegistrationVO } from '../vo/userRegistration.vo';

export type FindFilter = { id: number } | { email: UserEmailVO };
@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<PersistedUserEntity>,
  ) {}

  async create(registrationVO: UserRegistrationVO) {
    return await this.userRepository.save(registrationVO);
  }

  async doesEmailExits(emailVO: UserEmailVO): Promise<boolean> {
    const user = await this.userRepository.findOneBy({
      email: emailVO,
    });

    return !!user;
  }

  async find(filter: FindFilter): Promise<PersistedUserEntity | null> {
    const queryBuiider = this.userRepository.createQueryBuilder().select('*');

    const whereFilter = {
      id: {
        key: 'id = :id',
        param: { id: 'id' in filter && filter.id },
      },
      email: {
        key: 'email = :email',
        param: {
          email: 'email' in filter && filter.email.valueOf().toLowerCase(),
        },
      },
    };

    const key = Object.keys(filter)[0] as 'id' | 'email';
    const { key: where, param } = whereFilter[key];
    queryBuiider.where(where, param);

    return await queryBuiider.getOne();
  }
}
