import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EncryptionServiceProvider } from './service/encryption/encryption.service';
import { AuthServiceProvider } from './service/auth/auth.service';
import { SignUpPolicy } from './policy/signUp.policy';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [EncryptionServiceProvider, AuthServiceProvider, SignUpPolicy],
})
export class AuthModule {}
