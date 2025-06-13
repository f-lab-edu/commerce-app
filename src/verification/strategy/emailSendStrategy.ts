import { Inject, Injectable } from '@nestjs/common';
import { VeriSendStrategy } from './veriSendStrategy.interface';
import { VeriCodeVO } from '../vo/code.vo';
import { EmailSender } from '../email/email.service';
import { EmailFactory } from '../email/emailFactory';
import { UserEmailVO } from '../../user/vo/email.vo';
import { EmailSenderToken } from '../email/nodemailer/nodemailer.service';

@Injectable()
export class EmailSendStrategy implements VeriSendStrategy {
  constructor(
    @Inject(EmailSenderToken)
    private readonly emailSender: EmailSender,
  ) {}

  async send(target: string, code: VeriCodeVO): Promise<void> {
    const emailOption = EmailFactory.createVerificationEmail(
      code,
      new UserEmailVO(target),
    );
    await this.emailSender.sendEmail(emailOption);
  }
}
