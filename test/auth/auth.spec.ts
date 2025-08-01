import { Test, TestingModule } from '@nestjs/testing';
import { AuthApplicationServiceImpl } from '../../src/auth/service/auth/auth.applicationServiceImpl';
import { EncryptionServiceImpl } from '../../src/auth/service/encryption/encryption.serviceImpl';
import { UserServiceImpl } from '../../src/user/service/user.serviceImpl';
import { UserServiceToken } from '../../src/user/service/user.service';
import { EncryptionServiceToken } from '../../src/auth/service/encryption/encryption.service';
import { SignUpPolicyToken } from '../../src/auth/policy/signUp/signUp.policy';
import { VerificationService } from '../../src/verification/verification.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginCommand } from '../../src/auth/command/login.command';
import { UserEmailVO } from '../../src/user/vo/email.vo';
import { UserRawPasswordVO } from '../../src/user/vo/rawPassword.vo';
import {
  NotFoundException,
  WrongPassword,
} from '../../src/common/exception/domain.exception';

describe('Auth.ApplicationServiceImpl Service Test Suites', () => {
  let sut: AuthApplicationServiceImpl;
  let userServiceMock: jest.Mocked<UserServiceImpl>;
  let encryptionServiceMock: jest.Mocked<EncryptionServiceImpl>;
  let configServiceMock: jest.Mocked<ConfigService>;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const userServiceMockValues = {
      find: jest.fn(),
    };
    const encryptionServiceMockValues = {
      compare: jest.fn(),
    };

    const jwtServiceMockValues = {
      signAsync: jest.fn(),
    };

    const configServiceMockValues = {
      get: jest.fn().mockImplementation((args: string) => {
        switch (args) {
          case 'JWT_SECRET':
            return 'FAKE_SECRET';
          case 'JWT_ACCESS_EXPIRES_IN':
            return 'JWT_FAKE_EXPIRES_IN';
          case 'JWT_REFRESH_EXPIRES_IN':
            return 'JWT_FAKE_EXPIRES_IN';
          default:
            throw new Error('지원하지 않는 설정값입니다.');
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthApplicationServiceImpl,
        {
          provide: UserServiceToken,
          useValue: userServiceMockValues,
        },
        {
          provide: EncryptionServiceToken,
          useValue: encryptionServiceMockValues,
        },
        {
          provide: ConfigService,
          useValue: configServiceMockValues,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMockValues,
        },
        {
          provide: SignUpPolicyToken,
          useValue: {}, // login 케이스에는 사용하지 않음. DI 에러 방지용
        },
        {
          provide: VerificationService,
          useValue: {}, // login 케이스에는 사용하지 않음. DI 에러 방지용
        },
      ],
    }).compile();

    sut = module.get(AuthApplicationServiceImpl);
    userServiceMock = module.get(UserServiceToken);
    encryptionServiceMock = module.get(EncryptionServiceToken);
    configServiceMock = module.get(ConfigService);
    jwtServiceMock = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('로그인 테스트 케이스', () => {
    it('모킹 서비스들이 정의되어야합니다.', () => {
      expect(sut).toBeDefined();
      expect(userServiceMock).toBeDefined();
      expect(encryptionServiceMock).toBeDefined();
      expect(configServiceMock).toBeDefined();
      expect(jwtServiceMock).toBeDefined();
    });

    it('사용자는 이메일과 패스워드로 로그인을 할 수 있고, 성공시 액세스, 리프레시 토큰을 받습니다.', async () => {
      const fakeUser = {
        id: 1,
        password: 'test@1234',
      };
      const accessTokenData = 'TEST_ACCESS_TOKEN';
      const refreshTokenData = 'TEST_REFRESH_TOKEN';
      userServiceMock.find.mockResolvedValue(fakeUser as any);
      encryptionServiceMock.compare.mockResolvedValue(true);
      jwtServiceMock.signAsync
        .mockResolvedValueOnce(accessTokenData)
        .mockResolvedValueOnce(refreshTokenData);
      const loginCommand = new LoginCommand(
        new UserEmailVO('test@example.com'),
        new UserRawPasswordVO(fakeUser.password),
      );

      const { accessToken, refreshToken, user } = await sut.login(loginCommand);

      expect(user).toEqual(fakeUser);
      expect(accessToken).toBe(accessTokenData);
      expect(refreshToken).toBe(refreshTokenData);
    });

    it('없는 사용자 이메일로 로그인을 시도하면 에러를 던집니다.', async () => {
      const fakeUser = {
        id: 1,
        password: 'test@1234',
      };
      const loginCommand = new LoginCommand(
        new UserEmailVO('test@example.com'),
        new UserRawPasswordVO(fakeUser.password),
      );
      userServiceMock.find.mockResolvedValue(null);

      await expect(() => sut.login(loginCommand)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('비밀번호가 일치하지 않으면, 에러를 던집니다.', async () => {
      const fakeUser = {
        id: 1,
        password: 'test@1234',
      };
      const wrongPassword = '1234@test';
      const loginCommand = new LoginCommand(
        new UserEmailVO('test@example.com'),
        new UserRawPasswordVO(wrongPassword),
      );
      userServiceMock.find.mockResolvedValue(fakeUser as any);
      encryptionServiceMock.compare.mockResolvedValue(false);

      await expect(() => sut.login(loginCommand)).rejects.toThrow(
        WrongPassword,
      );
    });
  });
});
