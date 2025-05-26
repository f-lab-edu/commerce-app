import { Expose } from 'class-transformer';
import { BaseResponseDto } from '../../common/dto/base.dto';
import { TRole } from '../types';
import { IUserEntity, UserEntity } from '../entity/user.entity';

type TUserResponseDto = Omit<Required<UserEntity>, 'password'>;

export class UserResponseDto
  extends BaseResponseDto
  implements TUserResponseDto
{
  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: TRole;

  static from(p: IUserEntity): UserResponseDto {
    const dto = new UserResponseDto();

    if (!p.id || !p.createdAt || !p.updatedAt) {
      throw new Error('id,createdAt,updatedAt이 undefined입니다.');
    }

    dto.id = p.id;
    dto.createdAt = p.createdAt;
    dto.updatedAt = p.updatedAt;

    dto.email = p.email;
    dto.name = p.name;
    dto.role = p.role!;

    return dto;
  }
}
