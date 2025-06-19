import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
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
import { SuccessWithLocation } from '../common/decorator/successWithLocation.decorator';
import { SendVerificationDto } from '../verification/dto/sendCode.dto';
import { SendCodeCommand } from '../verification/command/sendCode.command';
import { VerificationMapper } from '../verification/dto/veri.mapper';
import { VerifyCodeDto } from '../verification/dto/verifyCode.dto';
import { VerifyCodeCommand } from '../verification/command/verifyCode.command';

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

  @Post('verification/send')
  async sendVerification(@Body() dto: SendVerificationDto) {
    const emailVeri = await this.verificationService.sendCode(
      new SendCodeCommand(dto.to),
    );
    return VerificationMapper.toResponseDto(emailVeri);
  }

  @Post('verification/verify')
  async verifyCode(@Body() dto: VerifyCodeDto) {
    await this.verificationService.verifyCode(
      new VerifyCodeCommand(dto.to, dto.code),
    );
    return { success: true };
  }
}
