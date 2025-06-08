import { Injectable } from '@nestjs/common';
import { VerificationApplicationService } from './verification.applicationService';
import { SendCodeCommand } from './command/sendCode.command';
import { VeriStrategyFactory } from './strategy/strategy.factory';
import { VeriCodeVO } from './vo/code.vo';

@Injectable()
export class VeriApplicationServiceImpl
  implements VerificationApplicationService
{
  constructor(private readonly veriStrategyFactory: VeriStrategyFactory) {}

  async sendCode(sendCodeCommand: SendCodeCommand) {
    const { method, target } = sendCodeCommand;
    const verificationStrategy = this.veriStrategyFactory.getStrategy(method);
    const veriCode = new VeriCodeVO(VeriCodeVO.generate());
    await verificationStrategy.send(target, veriCode);
  }
}
