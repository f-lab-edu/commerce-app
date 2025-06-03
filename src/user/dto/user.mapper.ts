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
import { UserHashedPasswordVO } from '../vo/hashedPassword.vo';

export class UserMapper {
  static toResponseDto(entity: PersistedUserEntity): UserResponseDto {
    const userResponseDto = UserResponseDto.from(entity);
    return instanceToPlain(userResponseDto) as UserResponseDto;
  }

  static toEntity(dto: IUserInput) {
    const { name, email, password } = dto;

    const requiredFields = { name, email, password };
    const isUndefinedFiled = ([key, val]) => val === undefined;
    const getUndefinedKeys = ([key, val]) => key;

    const undefinedFields = Object.entries(requiredFields)
      .filter(isUndefinedFiled)
      .map(getUndefinedKeys);

    const undefinedKeysInStr = undefinedFields.join(', ');

    if (undefinedFields.length > 0) {
      throw new Error(
        `${undefinedKeysInStr} 프로퍼티들은 undefined가 되지 않아야합니다. `,
      );
    }
    const p: IUserEntity = {
      name: new UserNameVO(name),
      email: new UserEmailVO(email),
      password: new UserHashedPasswordVO(password),
    };
    return UserEntity.from(p);
  }
}
