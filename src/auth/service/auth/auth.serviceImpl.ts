import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  UserService,
  UserServiceToken,
} from '../../../user/service/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../../user/interface/create.interface';
import {
  EncryptionService,
  EncryptionServiceToken,
} from '../encryption/encryption.service';
import { UserEntity } from '../../../user/entity/user.entity';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: UserService,
    @Inject(EncryptionServiceToken)
    private readonly encryptionService: EncryptionService,
  ) {}

  async signUp(dto: CreateUserDto) {
    const { email, password } = dto;

    if (email === password) {
      throw new BadRequestException('비밀번호는 이메일과 같을 수 없습니다.');
    }
    const hashedPassword = await this.encryptionService.hash(password);
    const dtoWithHashedPassword: Omit<UserEntity, 'role'> = {
      ...dto,
      password: hashedPassword,
    };

    return await this.userService.create(dtoWithHashedPassword);
  }
}
