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
  VerificationCodeSendException,
  VerificationValidExists,
} from '../common/exception/service.exception';
import { VERIFICATION_STATUS } from './entity/types';
import { VerificationService } from './verification.service';
import { UpdateVeriCommand } from './command/updateVeri.command';

@Injectable()
export class VeriApplicationServiceImpl
  implements VerificationApplicationService
{
  constructor(
    private readonly veriStrategyFactory: VeriStrategyFactory,
    private readonly verificationService: VerificationService,
  ) {}

  async sendCode(sendCodeCommand: SendCodeCommand) {
    const { method, target } = sendCodeCommand;

    const hasValidVeriCode = await this.verificationService.hasStillValidVeri(
      new UserEmailVO(target),
    );
    if (hasValidVeriCode) {
      throw new VerificationValidExists(
        `유효한 인증정보가 있습니다. 전송된 인증코드를 확인해 주세요.`,
      );
    }

    const verificationStrategy = this.veriStrategyFactory.getStrategy(method);
    const veriCode = new VeriCodeVO(VeriCodeVO.generate());

    let emailVeriEntity: PersistedEmailVerificationEntity | null = null;
    try {
      emailVeriEntity = await this.verificationService.saveVeriSendInfo(
        new CreateVeriCommand(veriCode, new UserEmailVO(target)),
      );
      await verificationStrategy.send(target, veriCode);
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
}
