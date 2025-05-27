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
import { SignUpPolicyToken } from '../../policy/signUp/signUp.policy';
import { IPolicy } from '../../../common/policy/policy';
import { SignUpDto } from '../../dto/signup.dto';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: UserService,
    @Inject(EncryptionServiceToken)
    private readonly encryptionService: EncryptionService,
    @Inject(SignUpPolicyToken)
    private readonly signUpPolicy: IPolicy<SignUpDto>,
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
