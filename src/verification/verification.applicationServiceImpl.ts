import { Injectable } from '@nestjs/common';
import { VerificationApplicationService } from './verification.applicationService';
import { SendCodeCommand } from './command/sendCode.command';
import { VeriSendStrategy } from './strategy/veriSendStrategy.interface';
import { VeriStrategyFactory } from './strategy/strategy.factory';

@Injectable()
export class VeriApplicationServiceImpl
  implements VerificationApplicationService
{
  constructor(private readonly veriStrategyFactory: VeriStrategyFactory) {}

  async sendCode(sendCodeCommand: SendCodeCommand) {
    const { method, target } = sendCodeCommand;
    const verificationStrategy = this.veriStrategyFactory.getStrategy(method);
  }
}
