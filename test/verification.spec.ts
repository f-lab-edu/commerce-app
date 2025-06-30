import { Test, TestingModule } from '@nestjs/testing';
import { VerificationApplicationServiceImpl } from '../src/verification/verification.applicationServiceImpl';
import { VerificationService } from '../src/verification/verification.service';
import { VeriCodeVO } from '../src/verification/vo/code.vo';
import { SendCodeCommand } from '../src/verification/command/sendCode.command';

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

  let verificationServiceMock: jest.Mocked<VerificationService>;

  beforeEach(async () => {
    const mockVerificationService = {
      isSendBlocked: jest.fn(),
      saveVeriSendInfo: jest.fn(),
      updateVeriInfo: jest.fn(),
      findLatestPendingVeri: jest.fn(),
      sendAndSave: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationApplicationServiceImpl,
        {
          provide: VerificationService,
          useValue: mockVerificationService,
        },
      ],
    }).compile();

    sut = module.get(VerificationApplicationServiceImpl);
    verificationServiceMock = module.get(VerificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('모킹 서비스들이 정의되어야합니다.', () => {
    expect(sut).toBeDefined();
    expect(verificationServiceMock).toBeDefined();
  });

  describe('sendCode 테스트 케이스', () => {
    const fakeEmail = 'test@gmail.com';
    const sendCodeCommandMock = new SendCodeCommand(fakeEmail);

    it('인증정보를 전달하면 전달된 인증채널로 인증코드를 전달한다.', async () => {
      const mockCode = '123456';
      jest.spyOn(VeriCodeVO, 'generate').mockReturnValue(mockCode);
      verificationServiceMock.isSendBlocked.mockResolvedValue(false);

      const verificationEntityMock: Partial<PersistedEmailVerificationEntity> =
        {
          email: new UserEmailVO(fakeEmail),
          code: new VeriCodeVO(mockCode),
          status: VERIFICATION_STATUS.PENDING,
        };
      verificationServiceMock.sendAndSave.mockResolvedValue(
        verificationEntityMock as any,
      );

      const result = await sut.sendCode(sendCodeCommandMock);

      expect(result).toEqual(expect.objectContaining(verificationEntityMock));
    });
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
