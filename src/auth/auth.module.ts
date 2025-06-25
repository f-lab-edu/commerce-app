import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EncryptionServiceProvider } from './service/encryption/encryption.service';
import { AuthApplicationServiceProvider } from './service/auth/auth.applicationService';
import { SignUpPolicyProvider } from './policy/signUp/signUp.policy';
import { VerificationModule } from '../verification/verfication.module';
import { CreateHeaderInterceptor } from '../common/interceptor/create.interceptor';

@Module({
  imports: [UserModule, VerificationModule],
  controllers: [AuthController],
  providers: [
    EncryptionServiceProvider,
    AuthApplicationServiceProvider,
    SignUpPolicyProvider,
    CreateHeaderInterceptor,
  ],
})
export class AuthModule {}
