import { instanceToPlain } from 'class-transformer';
import {
  IUserEntity,
  PersistedUserEntity,
  UserEntity,
} from '../entity/user.entity';
import { UserResponseDto } from './user.dto';
import { IUserInput } from '../interface/create.interface';
import { UserNameVO } from '../vo/name.vo';
import { UserEmailVO } from '../vo/email.vo';

export class UserMapper {
  static toResponseDto(entity: PersistedUserEntity): UserResponseDto {
    const userResponseDto = UserResponseDto.from(entity);
    return instanceToPlain(userResponseDto) as UserResponseDto;
  }

  static toEntity(dto: IUserInput) {
    const { name, email, password } = dto;

    const requiredFields = { name, email, password };
    const undefinedFields = Object.entries(requiredFields)
      .filter(([key, val]) => val === undefined)
      .map(([key]) => key);
    if (undefinedFields.length > 0) {
      throw new Error(`${undefinedFields.join(', ')}이 undefined입니다. `);
    }
    const p: IUserEntity = {
      name: new UserNameVO(name),
      email: new UserEmailVO(email),
      password,
    };
    return UserEntity.from(p);
  }
}
