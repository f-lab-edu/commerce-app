import { instanceToPlain } from 'class-transformer';
import { IUserEntity, UserEntity } from '../entity/user.entity';
import { UserResponseDto } from './user.dto';

export class UserMapper {
  static toResponseDto(entity: IUserEntity): UserResponseDto {
    const userResponseDto = UserResponseDto.from(entity);
    return instanceToPlain(userResponseDto) as UserResponseDto;
  }

  static toEntity(partial: Partial<IUserEntity>) {
    const { name, email, password } = partial;

    if (!name || !email || !password) {
      throw new Error('필수필드가 누락되어있습니다.');
    }

    const p: IUserEntity = { name, email, password };
    return UserEntity.from(p);
  }
}
