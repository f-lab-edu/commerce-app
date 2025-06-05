import { Injectable } from '@nestjs/common';
import { VerificationApplicationService } from './verification.applicationService';
import { SendCodeCommand } from './command/sendCode.command';

@Injectable()
export class VeriApplicationServiceImpl
  implements VerificationApplicationService
{
  constructor() {}

  async sendCode(sendCodeCommand: SendCodeCommand) {}
}
