import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationEntity } from './entity/emailVerification.entity';
import { VerificationApplicationServiceProvider } from './verification.applicationService';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerificationEntity])],
  providers: [VerificationApplicationServiceProvider],
  exports: [VerificationApplicationServiceProvider],
})
export class VerificationModule {}
