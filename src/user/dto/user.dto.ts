import { Expose } from 'class-transformer';
import { BaseResponseDto } from '../../common/dto/base.dto';
import { TRole } from '../types';
import { PersistedUserEntity, UserEntity } from '../entity/user.entity';

export class UserResponseDto extends BaseResponseDto {
  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: TRole;

  constructor(param: PersistedUserEntity) {
    super(param);
    const { email, name, role } = param;
    this.email = email.email;
    this.name = name;
    this.role = role;
  }

  static from(p: PersistedUserEntity): UserResponseDto {
    const dto = new UserResponseDto(p);

    return dto;
  }
}
