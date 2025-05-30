import { BadRequestException, Injectable } from '@nestjs/common';
import { PersistedUserEntity, UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMapper } from '../dto/user.mapper';
import { CreateUserDto } from '../interface/create.interface';
import { UserEmailVO } from '../vo/email.vo';

@Injectable()
export class UserServiceImpl {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<PersistedUserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const { email } = dto;
    const user = await this.userRepository.findOneBy({
      email: new UserEmailVO(email),
    });
    if (user) {
      throw new BadRequestException(`${email}로 등록한 유저가 이미 있습니다.`);
    }

    const newUser = UserMapper.toEntity(dto);

    return await this.userRepository.save(newUser);
  }
}
