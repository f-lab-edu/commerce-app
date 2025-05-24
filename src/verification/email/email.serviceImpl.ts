import { Injectable } from '@nestjs/common';
import { VerificationService } from '../email.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerificationEntity } from '../entity/emailVerification.entity';
import { Repository } from 'typeorm';
import { IEmailVerificationEntity } from '../../auth/interface/emailVerification.interface';
import dayjs from 'dayjs';
import { EmailVerificationMapper } from '../dto/emailVerification.mapper';

@Injectable()
export class EmailVerificationServiceImpl implements VerificationService {
  transporter: nodemailer.Transporter;
  user?: string;
  RANDOM_BYTES_LENGTH = 6; // 인증 코드 길이

  constructor(
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: Repository<EmailVerificationEntity>,
    private readonly configService: ConfigService,
  ) {
    this.user = this.configService.get<string>('TEST_EMAIL_ACCOUNT');
    const pass = this.configService.get<string>('TEST_EMAIL_PASS');

    if (!this.user || !pass) {
      throw new Error(
        '이메일 설정이 잘못 되었습니다. 환경 변수를 확인해주세요.',
      );
    }

    /**
     * Nodemailer를 사용하여 테스트 이메일 계정으로 SMTP 전송을 설정합니다.
     */
    this.transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: this.user,
        pass,
      },
    });
  }

  async sendCode(to: string) {
    const code = this.generateRandomCode();
    const mailOption: nodemailer.SendMailOptions = {
      from: this.user,
      to,
      subject: '인증 코드',
      text: `인증 코드: ${code}`,
      html: `<p>인증 코드: <strong>${code}</strong></p>`,
    };
    await this.transporter.sendMail(mailOption);

    const now = dayjs();
    const param: IEmailVerificationEntity = {
      email: to,
      code,
      expiredAt: dayjs(now).add(1, 'minute').toDate(),
      verifiedAt: null,
    };
    const emailEntity = EmailVerificationMapper.toEntity(param);
    const result = await this.emailVerificationRepository.save(emailEntity);
    console.log('result', result);
  }

  private generateRandomCode() {
    return randomBytes(this.RANDOM_BYTES_LENGTH)
      .toString('hex')
      .slice(0, this.RANDOM_BYTES_LENGTH);
  }
}
