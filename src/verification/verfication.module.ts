import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationEntity } from './entity/emailVerification.entity';
import { VerificationServiceProvider } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerificationEntity])],
  providers: [VerificationServiceProvider],
  exports: [VerificationServiceProvider],
})
export class VerificationModule {}
