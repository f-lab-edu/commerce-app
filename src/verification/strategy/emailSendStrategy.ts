import { Inject, Injectable } from '@nestjs/common';
import { VeriSendStrategy } from './veriSendStrategy.interface';
import { VeriCodeVO } from '../vo/code.vo';
import { EmailSender } from '../email/email.service';
import { EmailFactory } from '../email/emailFactory';
import { UserEmailVO } from '../../user/vo/email.vo';
import { EmailSenderToken } from '../email/nodemailer/nodemailer.service';
import { VerificationVO } from '../vo/verification.vo';
import { EmailSendException } from '../../common/exception/service.exception';

@Injectable()
export class EmailSendStrategy implements VeriSendStrategy {
  constructor(
    @Inject(EmailSenderToken)
    private readonly emailSender: EmailSender,
  ) {}

  async send(verificationVo: VerificationVO, code: VeriCodeVO): Promise<void> {
    const emailVo = verificationVo.getContact();
    if (!(emailVo instanceof UserEmailVO)) {
      throw new EmailSendException(
        '이메일 전송 중 시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        `유효하지 않은 ${UserEmailVO.name} 인스턴스입니다. Argument ${VerificationVO.name}를 확인하세요`,
      );
    }

    const emailOption = EmailFactory.createVerificationEmail(code, emailVo);
    await this.emailSender.sendEmail(emailOption);
  }
}
