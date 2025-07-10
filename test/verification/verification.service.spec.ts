import { Test, TestingModule } from '@nestjs/testing';
import { VerificationService } from '../../src/verification/verification.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailVerificationEntity } from '../../src/verification/entity/emailVerification.entity';
import { Repository } from 'typeorm';
import { VeriCodeVO } from '../../src/verification/vo/code.vo';
import { UserEmailVO } from '../../src/user/vo/email.vo';
import { VERIFICATION_STATUS } from '../../src/verification/entity/types';
import { VeriStrategyFactory } from '../../src/verification/strategy/strategy.factory';

describe('verificationService 테스트 suites', () => {
  let repository: jest.Mocked<Repository<EmailVerificationEntity>>;
  let service: VerificationService;
  let verificationStrategyFactoryMock: jest.Mocked<VeriStrategyFactory>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
    };

    const mockVerificationStrategy = {
      getStrategy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        {
          provide: getRepositoryToken(EmailVerificationEntity),
          useValue: mockRepository,
        },
        {
          provide: VeriStrategyFactory,
          useValue: mockVerificationStrategy,
        },
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
    repository = module.get(getRepositoryToken(EmailVerificationEntity));
    verificationStrategyFactoryMock = module.get(VeriStrategyFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('서비스 모킹이 정의가 되어 있어야합니다.', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
    expect(verificationStrategyFactoryMock).toBeDefined();
  });

  it('인증이 된 인증채널이 있으면 true를 반환해야합니다.', async () => {
    const email = new UserEmailVO('test@test.com');
    repository.find.mockResolvedValue([
      {
        id: 1,
        code: new VeriCodeVO('123456'),
        email,
        status: VERIFICATION_STATUS.VERIFIED,
        expiredAt: new Date(2025, 6, 29),
        verifiedAt: null,
        errorMessage: '',
      },
    ]);

    const actual = await service.isVerified({ to: email });

    expect(actual).toBeTruthy();
  });

  it('인증이 된 인증채널이 없으면 false를 반환해야합니다.', async () => {
    const email = new UserEmailVO('test@test.com');
    repository.find.mockResolvedValue([]);

    const actual = await service.isVerified({ to: email });

    expect(actual).toBeFalsy();
  });
});
