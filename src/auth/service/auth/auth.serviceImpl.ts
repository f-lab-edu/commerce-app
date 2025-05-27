import { Inject, Injectable } from '@nestjs/common';
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
import { SignUpPolicy } from '../../policy/signUp.policy';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: UserService,
    @Inject(EncryptionServiceToken)
    private readonly encryptionService: EncryptionService,
    private readonly signUpPolicy: SignUpPolicy,
  ) {}

  async signUp(dto: CreateUserDto) {
    await this.signUpPolicy.validate(dto);
    const { password } = dto;
    const hashedPassword = await this.encryptionService.hash(password);
    const dtoWithHashedPassword: Omit<UserEntity, 'role'> = {
      ...dto,
      password: hashedPassword,
    };

    return await this.userService.create(dtoWithHashedPassword);
  }
}
