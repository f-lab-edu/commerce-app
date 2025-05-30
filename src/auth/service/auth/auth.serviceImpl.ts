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
import { SignUpPolicyToken } from '../../policy/signUp/signUp.policy';
import { SignUpDto } from '../../dto/signup.dto';
import { IPolicyService } from '../../../common/policy/policy';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: UserService,
    @Inject(EncryptionServiceToken)
    private readonly encryptionService: EncryptionService,
    @Inject(SignUpPolicyToken)
    private readonly signUpPolicyService: IPolicyService<SignUpDto>,
  ) {}

  async signUp(dto: CreateUserDto) {
    await this.signUpPolicyService.validate(dto);

    const { password, email, name } = dto;
    const hashedPassword = await this.encryptionService.hash(password);

    const dtoWithHashedPassword: CreateUserDto = new CreateUserDto({
      email,
      name,
      password: hashedPassword,
    });

    return await this.userService.create(dtoWithHashedPassword);
  }
}
