import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  availableMethods,
  TVerificationMethod,
  VERIFICATION_METHODS,
} from '../command/sendCode.command';

export class SendVerificationDto {
  @IsString()
  @IsNotEmpty()
  target: string;

  @IsEnum(availableMethods)
  @IsOptional()
  method?: TVerificationMethod = VERIFICATION_METHODS.email;
}
