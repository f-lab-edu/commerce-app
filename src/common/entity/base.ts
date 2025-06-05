import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface IBaseEntity {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * TypeOrm BaseEntity와 이름중복이 있어서 'My'라는 프리픽스를 사용함
 */

export abstract class MyBaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  constructor(param?: IBaseEntity) {
    if (param) {
      const { createdAt, id, updatedAt } = param;
      this.id = id;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
}
