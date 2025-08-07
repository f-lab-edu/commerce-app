import { Injectable, NotImplementedException } from '@nestjs/common';
import { OrderEntity } from './entity/order.entity';
import { DataSource } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { BaseRepository } from '../common/repository/base.repository';

@Injectable()
export class OrderRepository extends BaseRepository<OrderEntity> {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly clsService: ClsService,
  ) {
    super(clsService, dataSource, OrderEntity);
  }

  async saveOrder() {
    throw new NotImplementedException();
  }
}
