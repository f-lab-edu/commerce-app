import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeMailerEmailSender } from './nodemailer.serviceImpl';

const EMAIL_PROVIDER = {
  nodemailer: 'nodemailer',
} as const;
type _EmailProvider = typeof EMAIL_PROVIDER;
type TEmailProvider = _EmailProvider[keyof _EmailProvider] | undefined;

export const EmailSenderToken = Symbol('EmailSenderToken');

export const EmailSenderProviderFactory = (configService: ConfigService) => {
  const emailProvider: TEmailProvider = configService.get('EMAIL_PROVIDER');
  if (!emailProvider) {
    throw new InternalServerErrorException(
      '환경변수 EMAIL_PROVIDER 가 누락되었습니다. 환경변수를 설정해 다시 시도하여 주십시오',
    );
  }

  switch (emailProvider) {
    case 'nodemailer':
      return new NodeMailerEmailSender(configService);
    default:
      const availableEmailSenders = Object.keys(EMAIL_PROVIDER).join(', ');
      throw new InternalServerErrorException(
        `${emailProvider}는 지원하지 않는 메일 서비스입니다. (가능: ${availableEmailSenders})`,
      );
  }
};

export const NodeMailerProvider = {
  provide: EmailSenderToken,
  useFactory: EmailSenderProviderFactory,
  inject: [ConfigService],
};
