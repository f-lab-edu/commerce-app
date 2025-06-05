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
import { SuccessWithLocation } from '../common/decorator/successWithLocation.decorator';
import { SendVerificationDto } from '../verification/dto/sendCode.dto';
import { SendCodeCommand } from '../verification/command/sendCode.command';

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
    return await this.verificationService.sendCode(
      new SendCodeCommand(dto.target),
    );
  }
}
