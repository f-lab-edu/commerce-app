import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EncryptionServiceProvider } from './service/encryption/encryption.service';
import { AuthApplicationServiceProvider } from './service/auth/auth.applicationService';
import { SignUpPolicyProvider } from './policy/signUp/signUp.policy';
import { VerificationModule } from '../verification/verfication.module';

@Module({
  imports: [UserModule, VerificationModule],
  controllers: [AuthController],
  providers: [
    EncryptionServiceProvider,
    AuthApplicationServiceProvider,
    SignUpPolicyProvider,
  ],
})
export class AuthModule {}
