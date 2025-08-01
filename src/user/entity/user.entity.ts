import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { TRole, USER_ROLE } from '../types';
import { IBaseEntity, MyBaseEntity } from '../../common/entity/base';
import { UserEmailVO } from '../vo/email.vo';
import { EmailVOTransformer } from './emailVO.transformer';
import { UserNameVO } from '../vo/name.vo';
import { NameVOTransformer } from './nameVO.transformer';
import { UserHashedPasswordVO } from '../vo/hashedPassword.vo';
import { HashedPasswordVOTransformer } from './hashedPasswordVO.transformer';
import { CommonConstraints } from '../../common/entity/base.constraints';
import { OrderEntity } from '../../order/entity/order.entity';

export interface IUserEntity extends IBaseEntity {
  email: UserEmailVO;
  name: UserNameVO;
  password: UserHashedPasswordVO;
  role?: TRole;
  orders?: OrderEntity[];
}

export type PersistedUserEntity = Required<IUserEntity>;

@Entity({ name: 'user' })
export class UserEntity extends MyBaseEntity implements IUserEntity {
  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
    length: UserEmailVO.constraints.maxLen,
    transformer: new EmailVOTransformer(),
  })
  email: UserEmailVO;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
    length: UserNameVO.constraints.maxLen,
    transformer: new NameVOTransformer(),
  })
  name: UserNameVO;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
    length: UserHashedPasswordVO.constraints.maxLen,
    transformer: new HashedPasswordVOTransformer(),
  })
  password: UserHashedPasswordVO;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
    length: 10,
    default: USER_ROLE.buyer,
  })
  role: TRole;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders?: Relation<OrderEntity>[];

  constructor(param?: IUserEntity) {
    super(param);
    if (param) {
      const { email, name, password, role, orders } = param;
      this.email = email;
      this.name = name;
      this.password = password;
      this.role = role ?? USER_ROLE.buyer;
      this.orders = orders;
    }
  }

  static from(param: IUserEntity) {
    const newUser = new UserEntity(param);

    return newUser;
  }
}
