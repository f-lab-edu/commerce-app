import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService, AuthServiceToken } from './service/auth/auth.service';
import { UserMapper } from '../user/dto/user.mapper';
import {
  VerificationService,
  VerificationServiceToken,
} from '../verification/email.service';
import { EmailVerificationCodeDto } from '../verification/dto/sendCode.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthServiceToken)
    private readonly authService: AuthService,

    @Inject(VerificationServiceToken)
    private readonly verificationService: VerificationService, // Replace with actual type
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(signUpDto);

    return UserMapper.toResponseDto(user);
  }

  @Post('email-verification/send')
  async sendEmailVerification(@Body() dto: EmailVerificationCodeDto) {
    const { email } = dto;
    return await this.verificationService.sendCode(email);
  }
}
