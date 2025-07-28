import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EncryptionServiceProvider } from './service/encryption/encryption.service';
import { AuthApplicationServiceProvider } from './service/auth/auth.applicationService';
import { SignUpPolicyProvider } from './policy/signUp/signUp.policy';
import { VerificationModule } from '../verification/verfication.module';
import { LocationHeaderInterceptor } from '../common/interceptor/create.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    VerificationModule,
    JwtModule.register({ global: true }),
  ],
  controllers: [AuthController],
  providers: [
    EncryptionServiceProvider,
    AuthApplicationServiceProvider,
    SignUpPolicyProvider,
    LocationHeaderInterceptor,
  ],
})
export class AuthModule {}
