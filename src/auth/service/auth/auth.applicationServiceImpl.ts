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
import { VerificationCodeNotFoundException } from '../../../common/exception/service.exception';
import {
  NotFoundException,
  WrongPassword,
} from '../../../common/exception/domain.exception';
import { LoginCommand } from '../../command/login.command';
import { PersistedUserEntity } from '../../../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { ConfigException } from '../../../common/exception/internal.exception';
import { JwtConfigData, LoginResData } from '../../types/auth.type';

type JwtPayload = {
  id: number;
};

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
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
      throw new VerificationCodeNotFoundException(
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

  async login({ email, password }: LoginCommand): Promise<LoginResData> {
    const user = await this.userService.find({ email });
    if (!user) {
      throw new NotFoundException(
        `이메일 ${email}에 일치하는 사용자가 없어요.다시 시도해주세요`,
      );
    }

    const isPasswordSame = await this.encryptionService.compare(
      password,
      user.password,
    );
    if (!isPasswordSame) {
      throw new WrongPassword(
        `${email.valueOf()} 로그인 시도가 실패했어요. 잘못된 비밀번호입니다. `,
      );
    }

    const { accessToken, refreshToken } = await this.generateJwtTokens(user);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  private getJwtConfigs(): JwtConfigData {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new ConfigException(
        '토큰 시크릿이 없어요. 설정파일을 확인해주세요',
      );
    }

    const accessExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    let message = '';

    if (!accessExpiresIn) {
      message += '액세스 토큰';
    }

    if (!refreshExpiresIn) {
      message += ', 리프레시 토큰의';
    }

    const hasConfigError = !accessExpiresIn || !refreshExpiresIn;
    if (hasConfigError) {
      throw new ConfigException(
        message + '만료시간이 설정되지 않았어요. 설정 파일을 확인해주세요',
      );
    }

    return {
      accessJwtConfig: {
        secret,
        expiresIn: accessExpiresIn,
      },
      refreshJwtConfig: {
        secret,
        expiresIn: refreshExpiresIn,
      },
    };
  }

  private async generateJwtTokens(user: PersistedUserEntity) {
    const jwtData: JwtPayload = {
      id: user.id,
    };
    const { accessJwtConfig, refreshJwtConfig } = this.getJwtConfigs();
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtData, { ...accessJwtConfig }),
      this.jwtService.signAsync(jwtData, { ...refreshJwtConfig }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
