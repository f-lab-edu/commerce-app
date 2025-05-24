import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EncryptionServiceProvider } from './service/encryption/encryption.service';
import { AuthServiceProvider } from './service/auth/auth.service';
import { VerificationModule } from '../verification/verfication.module';

@Module({
  imports: [UserModule, VerificationModule],
  controllers: [AuthController],
  providers: [EncryptionServiceProvider, AuthServiceProvider],
})
export class AuthModule {}
