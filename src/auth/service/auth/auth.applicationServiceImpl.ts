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
import { VerificationService } from '../../../verification/verification.service';
import { VerificationValidNotExists } from '../../../common/exception/service.exception';

@Injectable()
export class AuthApplicationServiceImpl implements AuthApplicationService {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: UserService,
    @Inject(EncryptionServiceToken)
    private readonly encryptionService: EncryptionService,
    @Inject(SignUpPolicyToken)
    private readonly signUpPolicyService: IPolicyService<SignUpDto>,
    private readonly verificationService: VerificationService,
  ) {}

  async signUp(dto: IUserInput) {
    await this.signUpPolicyService.validate(dto);
    const { password, email, name } = dto;

    const emailVo = new UserEmailVO(email);

    const emailExits = await this.userService.doesEmailExits(emailVo);
    if (emailExits) {
      throw new BadRequestException(`${email}로 등록한 유저가 이미 있습니다.`);
    }

    const isVerified = await this.verificationService.isVerified({
      to: emailVo,
    });

    if (!isVerified) {
      throw new VerificationValidNotExists(
        `인증되지 않았습니다. 인증을 완료하여 주시길 바랍니다. `,
      );
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
