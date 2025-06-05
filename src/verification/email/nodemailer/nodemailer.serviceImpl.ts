import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailSender } from '../email.service';
import { EmailOptionVO } from '../../vo/emailOption.vo';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { UserEmailVO } from '../../../user/vo/email.vo';

@Injectable()
export class NodeMailerEmailSender implements EmailSender {
  private transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  private smtpEmail: UserEmailVO;
  private pass: string;

  constructor(private readonly configService: ConfigService) {
    this.validateConfiguration();
    this.initTransporter();
  }

  private validateConfiguration() {
    const message = (target: string) =>
      `이메일 서비스 사용을 위한 ${target}이 누락되었습니다. 환경변수를 설정 후 애플리케이션을 다시 시작해주세요.`;

    const smptEmail = this.configService.get('TEST_EMAIL_ACCOUNT');

    if (!smptEmail) {
      throw new InternalServerErrorException(message('이메일'));
    }

    this.smtpEmail = new UserEmailVO(smptEmail);

    const pass = this.configService.get('TEST_EMAIL_PASS');
    if (!pass) {
      throw new InternalServerErrorException(message('비밀번호'));
    }
    this.pass = pass;
  }

  private initTransporter() {
    const host = 'smtp.naver.com';
    const port = 587;
    const auth = {
      user: this.smtpEmail.email,
      pass: this.pass,
    };
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      requireTLS: true,
      auth,
    });
  }

  async sendEmail(emailOption: EmailOptionVO): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: emailOption.from,
        to: emailOption.to.email,
        subject: emailOption.subject,
        html: emailOption.content.html,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `이메일 발송에 실패했습니다. ${error.message}`,
      );
    }
  }
}
