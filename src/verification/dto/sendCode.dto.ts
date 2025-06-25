import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  availableMethods,
  TVerificationMethod,
  VERIFICATION_CHANNELS,
} from '../command/sendCode.command';

export class SendVerificationDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsEnum(availableMethods)
  @IsOptional()
  channel?: TVerificationMethod = VERIFICATION_CHANNELS.email;
}
