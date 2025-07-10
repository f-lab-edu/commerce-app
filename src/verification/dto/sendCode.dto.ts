import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  availableMethods,
  VERIFICATION_CHANNELS,
  VerificationChannel,
} from '../command/sendCode.command';

export class SendVerificationDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsEnum(availableMethods)
  @IsOptional()
  channel?: VerificationChannel = VERIFICATION_CHANNELS.email;
}
