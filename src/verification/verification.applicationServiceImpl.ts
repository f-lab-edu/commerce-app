import { Injectable } from '@nestjs/common';
import { VerificationApplicationService } from './verification.applicationService';
import { SendCodeCommand } from './command/sendCode.command';
import { VeriStrategyFactory } from './strategy/strategy.factory';
import { VeriCodeVO } from './vo/code.vo';
import { PersistedEmailVerificationEntity } from './entity/emailVerification.entity';
import { VerificationHistoryCreateCommand } from './vo/saveCode.command';
import { UserEmailVO } from '../user/vo/email.vo';
import {
  EmailSendException,
  VerificationCodeAlreadyVerifiedException,
  VerificationCodeMismatchException,
  VerificationCodeSendException,
  VerificationExpiredException,
  VerificationValidExists,
  VerificationValidNotExists,
} from '../common/exception/service.exception';
import { VERIFICATION_STATUS } from './entity/types';
import { VerificationService } from './verification.service';
import { UpdateVeriCommand } from './command/updateVeri.command';
import { VerifyCodeCommand } from './command/verifyCode.command';
import { VerificationVO } from './vo/verification.vo';

@Injectable()
export class VerificationApplicationServiceImpl
  implements VerificationApplicationService
{
  constructor(private readonly verificationService: VerificationService) {}

  async sendCode(sendCodeCommand: SendCodeCommand) {
    const { channel, to } = sendCodeCommand;
    const verificationVO = VerificationVO.from(to, channel);

    const isSendBlocked =
      await this.verificationService.isSendBlocked(verificationVO);
    if (isSendBlocked) {
      throw new VerificationValidExists(
        `유효한 인증정보가 있습니다. 전송된 인증코드를 확인해 주세요.`,
      );
    }

    const verificationCodeVO = new VeriCodeVO(VeriCodeVO.generate());

    return await this.verificationService.sendAndSave({
      verificationCodeVO,
      verificationVO,
    });
  }

  async verifyCode(verifyCodeCommand: VerifyCodeCommand): Promise<void> {
    const { code, to } = verifyCodeCommand;
    const codeVo = new VeriCodeVO(code);

    const emailVo = new UserEmailVO(to);
    const verificationEntity =
      await this.verificationService.findLatestPendingVeri(emailVo);

    if (verificationEntity === null) {
      throw new VerificationValidNotExists(
        `${to}로 발송된 인증정보가 없습니다.`,
      );
    }

    if (verificationEntity.expiredAt < new Date()) {
      throw new VerificationExpiredException(
        '인증코드가 만료되었습니다. 다시 요청해주세요',
      );
    }

    if (!codeVo.equals(verificationEntity.code)) {
      throw new VerificationCodeMismatchException(
        `인증코드 ${codeVo.veriCode}는 일치하지 않는 인증코드입니다.. 올바른 인증코드로 다시 인증을 시도하여 주십시오.`,
      );
    }

    if (verificationEntity.status === VERIFICATION_STATUS.VERIFIED) {
      throw new VerificationCodeAlreadyVerifiedException(
        `인증코드 ${codeVo.veriCode}는 이미 처리된 인증코드입니다. 다시 시도하여 주시길 바랍니다.`,
      );
    }

    const updateCommand = new UpdateVeriCommand({
      id: verificationEntity.id,
      status: { status: VERIFICATION_STATUS.VERIFIED },
      verifiedAt: new Date(),
    });

    await this.verificationService.updateVeriInfo(updateCommand);
  }
}
