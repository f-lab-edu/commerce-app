import { Expose } from 'class-transformer';

export interface IBaseResponseDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseResponseDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(param: IBaseResponseDto) {
    const { createdAt, id, updatedAt } = param;
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
