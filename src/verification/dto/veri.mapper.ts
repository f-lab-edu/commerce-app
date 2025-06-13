import { instanceToPlain } from 'class-transformer';
import { PersistedEmailVerificationEntity } from '../entity/emailVerification.entity';
import { VerificationResponseDto } from './veri.dto';

export class VerificationMapper {
  static toResponseDto(entity: PersistedEmailVerificationEntity) {
    const veriResponse = new VerificationResponseDto(entity);
    return instanceToPlain(veriResponse) as VerificationResponseDto;
  }
}
