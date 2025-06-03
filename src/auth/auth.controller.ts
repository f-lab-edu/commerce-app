import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import {
  AuthApplicationService,
  AuthApplicationServiceToken,
} from './service/auth/auth.applicationService';
import { UserMapper } from '../user/dto/user.mapper';
import {
  VerificationApplicationService,
  VerificationServiceToken,
} from '../verification/verification.applicationService';
import { EmailVerificationCodeDto } from '../verification/dto/sendCode.dto';
import { SuccessWithLocation } from '../common/decorator/successWithLocation.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthApplicationServiceToken)
    private readonly authApplicationService: AuthApplicationService,
    @Inject(VerificationServiceToken)
    private readonly verificationService: VerificationApplicationService,
  ) {}

  @Post('sign-up')
  @SuccessWithLocation()
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
