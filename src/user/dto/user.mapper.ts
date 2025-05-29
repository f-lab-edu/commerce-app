import { instanceToPlain } from 'class-transformer';
import {
  IUserEntity,
  PersistedUserEntity,
  UserEntity,
} from '../entity/user.entity';
import { UserResponseDto } from './user.dto';

export class UserMapper {
  static toResponseDto(entity: PersistedUserEntity): UserResponseDto {
    const userResponseDto = UserResponseDto.from(entity);
    return instanceToPlain(userResponseDto) as UserResponseDto;
  }

  static toEntity(dto: IUserEntity) {
    const { name, email: emailVO, password } = dto;

    const requiredFields = { name, email: emailVO.email, password };
    const undefinedFields = Object.entries(requiredFields)
      .filter(([key, val]) => val === undefined)
      .map(([key]) => key);
    if (undefinedFields.length > 0) {
      throw new Error(`${undefinedFields.join(', ')}이 undefined입니다. `);
    }

    const p: IUserEntity = { name, email: emailVO, password };
    return UserEntity.from(p);
  }
}
