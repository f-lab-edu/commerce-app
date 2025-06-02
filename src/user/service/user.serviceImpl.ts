import { Injectable } from '@nestjs/common';
import { PersistedUserEntity, UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEmailVO } from '../vo/email.vo';
import { UserService } from './user.service';
import { UserRegistrationVO } from '../vo/userRegistration.vo';

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
}
