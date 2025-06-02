import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EncryptionServiceProvider } from './service/encryption/encryption.service';
import { AuthApplicationServiceProvider } from './service/auth/authApplication.service';
import { SignUpPolicyProvider } from './policy/signUp/signUp.policy';
import { CreateHeaderInterceptor } from '../common/interceptor/create.interceptor';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    EncryptionServiceProvider,
    AuthApplicationServiceProvider,
    SignUpPolicyProvider,
    CreateHeaderInterceptor,
  ],
})
export class AuthModule {}
