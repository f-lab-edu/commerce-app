import { IVerificationEntity } from './verification.interface';

export interface IEmailVerificationEntity extends IVerificationEntity {
  email: string;
}
