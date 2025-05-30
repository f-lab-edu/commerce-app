import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import {
  AuthApplicationService,
  AuthApplicationServiceToken,
} from './service/auth/authApplication.service';
import { UserMapper } from '../user/dto/user.mapper';
import {
  VerificationService,
  VerificationServiceToken,
} from '../verification/email.service';
import { EmailVerificationCodeDto } from '../verification/dto/sendCode.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthApplicationServiceToken)
    private readonly authApplicationService: AuthApplicationService,
    @Inject(VerificationServiceToken)
    private readonly verificationService: VerificationService,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authApplicationService.signUp(signUpDto);

    return UserMapper.toResponseDto(user);
  }

  @Post('email-verification/send')
  async sendEmailVerification(@Body() dto: EmailVerificationCodeDto) {
    const { email } = dto;
    return await this.verificationService.sendCode(email);
  }
}
