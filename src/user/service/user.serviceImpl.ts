import { Injectable } from '@nestjs/common';
import { PersistedUserEntity, UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEmailVO } from '../vo/email.vo';
import { UserService } from './user.service';
import { UserRegistrationVO } from '../vo/userRegistration.vo';
import { TypeError } from '../../common/exception/internal.exception';

type IdFilter = {
  type: 'id';
  id: number;
};
type EmailFilter = {
  type: 'email';
  email: UserEmailVO;
};

export type FindFilter = IdFilter | EmailFilter;

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
    const queryBuiider = this.userRepository.createQueryBuilder().select();

    const filterHandlers = (filter: FindFilter) => {
      switch (filter.type) {
        case 'id':
          return {
            where: 'id = :id',
            params: { id: filter.id },
          };
        case 'email':
          return {
            where: 'email = :email',
            params: { email: filter.email.valueOf() },
          };
        default:
          throw new TypeError({
            clientMsg: '지원하지 않는 필터링 방식이에요.',
            devMsg: `${JSON.stringify(filter)}은 지원하지 않는 타입이에요.`,
          });
      }
    };

    const { params, where } = filterHandlers(filter);

    queryBuiider.where(where, params);

    return await queryBuiider.getOne();
  }
}
