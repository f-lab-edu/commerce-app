import { Test, TestingModule } from '@nestjs/testing';
import { VerificationApplicationServiceImpl } from '../src/verification/verification.applicationServiceImpl';
import { VerificationService } from '../src/verification/verification.service';
import { VeriSendStrategy } from '../src/verification/strategy/veriSendStrategy.interface';
import { VeriStrategyFactory } from '../src/verification/strategy/strategy.factory';
import { VeriCodeVO } from '../src/verification/vo/code.vo';
import { SendCodeCommand } from '../src/verification/command/sendCode.command';
import {
  EmailSendException,
  VerificationCodeSendException,
  VerificationValidExists,
} from '../src/common/exception/service.exception';
import {
  EmailVerificationEntity,
  PersistedEmailVerificationEntity,
} from '../src/verification/entity/emailVerification.entity';
import { VERIFICATION_STATUS } from '../src/verification/entity/types';
import { UpdateVeriCommand } from '../src/verification/command/updateVeri.command';
import { UserEmailVO } from '../src/user/vo/email.vo';
import { VerifyCodeCommand } from '../src/verification/command/verifyCode.command';

describe('인증번호 발송 서비스 테스트 VerificationApplicationService', () => {
  let sut: VerificationApplicationServiceImpl;

  const fakeEmail = 'test@gmail.com';
  const sendCodeCommandMock = new SendCodeCommand(fakeEmail);
  let verificationServiceMock: jest.Mocked<
    Pick<
      VerificationService,
      | 'findLatestPendingVeri'
      | 'hasStillValidVeri'
      | 'saveVeriSendInfo'
      | 'updateVeriInfo'
    >
  >;

  let veriSendStrategyMock: Partial<VeriSendStrategy>;
  let veriStrategyFactoryMock: Partial<VeriStrategyFactory>;

  beforeEach(async () => {
    verificationServiceMock = {
      hasStillValidVeri: jest.fn(),
      saveVeriSendInfo: jest.fn(),
      updateVeriInfo: jest.fn(),
      findLatestPendingVeri: jest.fn(),
    };

    veriSendStrategyMock = {
      send: jest.fn(),
    };

    veriStrategyFactoryMock = {
      getStrategy: jest.fn().mockReturnValue(veriSendStrategyMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationApplicationServiceImpl,
        {
          provide: VerificationService,
          useValue: verificationServiceMock,
        },
        {
          provide: VeriStrategyFactory,
          useValue: veriStrategyFactoryMock,
        },
      ],
    }).compile();

    sut = module.get(VerificationApplicationServiceImpl);
    verificationServiceMock = module.get(VerificationService);
    veriStrategyFactoryMock = module.get(VeriStrategyFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('모킹 서비스들이 정의되어야합니다.', () => {
    expect(sut).toBeDefined();
    expect(verificationServiceMock).toBeDefined();
    expect(veriStrategyFactoryMock).toBeDefined();
  });

  it(`발송후 ${VeriCodeVO.constraints.expireInMinute}이 지나지 않은 이메일이 있으면 에러를 던집니다.`, async () => {
    (verificationServiceMock.hasStillValidVeri as jest.Mock).mockResolvedValue(
      true,
    );
    await expect(sut.sendCode(sendCodeCommandMock)).rejects.toThrow(
      VerificationValidExists,
    );
  });

  it('인증정보 발송 상태를 데이터베이스 저장에 실패하면 에러를 던집니다.', async () => {
    (verificationServiceMock.hasStillValidVeri as jest.Mock).mockResolvedValue(
      false,
    );

    (verificationServiceMock.saveVeriSendInfo as jest.Mock).mockRejectedValue(
      new Error('DB save failed'),
    );
    await expect(sut.sendCode(sendCodeCommandMock)).rejects.toThrow(
      VerificationCodeSendException,
    );
  });

  it('이메일 발송에 실패하면 에러를 던지고 인증정보 상태를 업데이트합니다.', async () => {
    (verificationServiceMock.hasStillValidVeri as jest.Mock).mockResolvedValue(
      false,
    );
    const fakeId = 1;
    const mockEntity: Partial<PersistedEmailVerificationEntity> = {
      id: fakeId,
    };
    (verificationServiceMock.saveVeriSendInfo as jest.Mock).mockResolvedValue(
      mockEntity,
    );
    const mockErrorMessage = '이메일 전송 실패';
    (veriSendStrategyMock.send as jest.Mock).mockRejectedValue(
      new EmailSendException(mockErrorMessage),
    );
    const updateVeriInfoSpy = jest.spyOn(
      verificationServiceMock as jest.Mocked<VerificationService>,
      'updateVeriInfo',
    );

    await expect(sut.sendCode(sendCodeCommandMock)).rejects.toThrow(
      VerificationCodeSendException,
    );
    expect(updateVeriInfoSpy).toHaveBeenCalledWith(
      new UpdateVeriCommand({
        id: mockEntity.id!,
        status: {
          status: VERIFICATION_STATUS.FAIL,
          errorMessage: mockErrorMessage,
        },
      }),
    );
  });

  it('인증정보를 성공적으로 발송하고 데이터베이스에 저장하면 해당 정보를 반환합니다.', async () => {
    (verificationServiceMock.hasStillValidVeri as jest.Mock).mockResolvedValue(
      false,
    );
    const fakeId = 1;
    const mockEntity: Partial<PersistedEmailVerificationEntity> = {
      id: fakeId,
      email: new UserEmailVO(fakeEmail),
      status: VERIFICATION_STATUS.PENDING,
    };
    (verificationServiceMock.saveVeriSendInfo as jest.Mock).mockResolvedValue(
      mockEntity,
    );
    (veriSendStrategyMock.send as jest.Mock).mockResolvedValue(undefined);

    const result = await sut.sendCode(sendCodeCommandMock);
    expect(result).toEqual(mockEntity);
  });

  describe('verifyCode 테스트 케이스', () => {
    const fakeEmail = 'test@gmail.com';
    const fakeCode = '123456';
    const fakeId = 1;

    const fakeExpiredAt = new Date(2025, 6, 20, 12, 0);
    const expiredUnit = VeriCodeVO.constraints.expireInMinute;
    const oneMin = 60 * 1000;

    const fakeEmailEntity: Partial<EmailVerificationEntity> = {
      id: fakeId,
      expiredAt: fakeExpiredAt,
      code: new VeriCodeVO(fakeCode),
      status: VERIFICATION_STATUS.PENDING,
    };

    it('유효한 코드와 함께 이메일을 인증하면 이메일 인증정보가 업데이트 된다.', async () => {
      const verifyCodeCommand = new VerifyCodeCommand(fakeEmail, fakeCode);

      verificationServiceMock.findLatestPendingVeri.mockResolvedValue(
        fakeEmailEntity as Required<EmailVerificationEntity>,
      );

      // 현재시간을 코드가 만료되는 시간보다 이른 시간으로 설정
      const fakeCurrentDateEarlierThanExpiredAt = new Date(
        fakeExpiredAt.getTime() - expiredUnit * oneMin,
      );
      jest
        .spyOn(global, 'Date')
        .mockImplementation(() => fakeCurrentDateEarlierThanExpiredAt);

      const fakeUpdateCommand = new UpdateVeriCommand({
        id: fakeId,
        status: { status: VERIFICATION_STATUS.VERIFIED },
        verifiedAt: fakeCurrentDateEarlierThanExpiredAt,
      });

      await sut.verifyCode(verifyCodeCommand);

      expect(verificationServiceMock.updateVeriInfo).toHaveBeenCalledWith(
        fakeUpdateCommand,
      );
    });
  });
});
