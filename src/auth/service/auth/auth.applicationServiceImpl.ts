import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  UserService,
  UserServiceToken,
} from '../../../user/service/user.service';
import { AuthApplicationService } from './auth.applicationService';
import { IUserInput } from '../../../user/interface/create.interface';
import {
  EncryptionService,
  EncryptionServiceToken,
} from '../encryption/encryption.service';
import { SignUpPolicyToken } from '../../policy/signUp/signUp.policy';
import { SignUpDto } from '../../dto/signup.dto';
import { IPolicyService } from '../../../common/policy/policy';
import { UserEmailVO } from '../../../user/vo/email.vo';
import { UserRawPasswordVO } from '../../../user/vo/rawPassword.vo';
import { UserRegistrationVO } from '../../../user/vo/userRegistration.vo';

@Injectable()
export class AuthApplicationServiceImpl implements AuthApplicationService {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: UserService,
    @Inject(EncryptionServiceToken)
    private readonly encryptionService: EncryptionService,
    @Inject(SignUpPolicyToken)
    private readonly signUpPolicyService: IPolicyService<SignUpDto>,
  ) {}

  async signUp(dto: IUserInput) {
    await this.signUpPolicyService.validate(dto);
    const { password, email, name } = dto;

    const emailExits = await this.userService.doesEmailExits(
      new UserEmailVO(email),
    );
    if (emailExits) {
      throw new BadRequestException(`${email}로 등록한 유저가 이미 있습니다.`);
    }

    const { hashedPassword } = await this.encryptionService.hash(
      new UserRawPasswordVO(password),
    );

    const dtoWithHashedPassword = new UserRegistrationVO({
      name,
      email,
      password: hashedPassword,
    });

    return await this.userService.create(dtoWithHashedPassword);
  }
}
