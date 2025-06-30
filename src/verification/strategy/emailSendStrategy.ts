import { Inject, Injectable } from '@nestjs/common';
import { VeriSendStrategy } from './veriSendStrategy.interface';
import { VeriCodeVO } from '../vo/code.vo';
import { EmailSender } from '../email/email.service';
import { EmailFactory } from '../email/emailFactory';
import { UserEmailVO } from '../../user/vo/email.vo';
import { EmailSenderToken } from '../email/nodemailer/nodemailer.service';
import { VerificationVO } from '../vo/verification.vo';
import {
  VERIFICATION_CHANNELS,
  VerificationChannel,
} from '../command/sendCode.command';

@Injectable()
export class EmailSendStrategy implements VeriSendStrategy {
  constructor(
    @Inject(EmailSenderToken)
    private readonly emailSender: EmailSender,
  ) {}

  async send(verificationVo: VerificationVO, code: VeriCodeVO): Promise<void> {
    const emailVo = verificationVo.getContact();
    if (!(emailVo instanceof UserEmailVO)) {
      throw new Error();
    }

    const emailOption = EmailFactory.createVerificationEmail(code, emailVo);
    await this.emailSender.sendEmail(emailOption);
  }
}
