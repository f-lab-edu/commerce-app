import { Injectable } from '@nestjs/common';
import { OrderEntity, PersistedOrderEntity } from './entity/order.entity';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

@Injectable()
export class OrderRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  async saveOrder(order: OrderEntity): Promise<PersistedOrderEntity> {
    return (await this.txHost.tx
      .getRepository(OrderEntity)
      .save(order)) as PersistedOrderEntity;
  }
}
