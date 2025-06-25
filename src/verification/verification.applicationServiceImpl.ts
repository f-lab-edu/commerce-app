import { Injectable } from '@nestjs/common';
import { VerificationApplicationService } from './verification.applicationService';
import { SendCodeCommand } from './command/sendCode.command';
import { VeriStrategyFactory } from './strategy/strategy.factory';
import { VeriCodeVO } from './vo/code.vo';
import { PersistedEmailVerificationEntity } from './entity/emailVerification.entity';
import { CreateVeriCommand } from './vo/saveCode.command';
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

@Injectable()
export class VeriApplicationServiceImpl
  implements VerificationApplicationService
{
  constructor(
    private readonly veriStrategyFactory: VeriStrategyFactory,
    private readonly verificationService: VerificationService,
  ) {}

  async sendCode(sendCodeCommand: SendCodeCommand) {
    const { channel, to } = sendCodeCommand;

    const hasValidVeriCode = await this.verificationService.hasStillValidVeri(
      new UserEmailVO(to),
    );
    if (hasValidVeriCode) {
      throw new VerificationValidExists(
        `유효한 인증정보가 있습니다. 전송된 인증코드를 확인해 주세요.`,
      );
    }

    const verificationStrategy = this.veriStrategyFactory.getStrategy(channel);
    const veriCode = new VeriCodeVO(VeriCodeVO.generate());

    let emailVeriEntity: PersistedEmailVerificationEntity | null = null;
    try {
      emailVeriEntity = await this.verificationService.saveVeriSendInfo(
        new CreateVeriCommand(veriCode, new UserEmailVO(to)),
      );
      await verificationStrategy.send(to, veriCode);
      return emailVeriEntity;
    } catch (error) {
      if (error instanceof EmailSendException && emailVeriEntity !== null) {
        await this.verificationService.updateVeriInfo(
          new UpdateVeriCommand({
            id: emailVeriEntity.id!,
            status: {
              status: VERIFICATION_STATUS.FAIL,
              errorMessage: error.message,
            },
          }),
        );
        throw new VerificationCodeSendException(error.message);
      }

      throw new VerificationCodeSendException(
        '인증코드 저장에 실패했습니다. DB상태를 확인해주세요.',
      );
    }
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
