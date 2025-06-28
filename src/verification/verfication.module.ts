import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationEntity } from './entity/emailVerification.entity';
import { VerificationApplicationServiceProvider } from './verification.applicationService';
import { EmailSendStrategy } from './strategy/emailSendStrategy';
import { SmsSendStrategy } from './strategy/smsSendStrategy';
import { NodeMailerProvider } from './email/nodemailer/nodemailer.service';
import { VeriStrategyFactory } from './strategy/strategy.factory';
import { VerificationService } from './verification.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerificationEntity])],
  providers: [
    VerificationApplicationServiceProvider,
    EmailSendStrategy,
    SmsSendStrategy,
    NodeMailerProvider,
    VeriStrategyFactory,
    VerificationService,
  ],
  exports: [VerificationApplicationServiceProvider, VerificationService],
})
export class VerificationModule {}
