import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import {
  PersistedProductPriceEntity,
  ProductPriceEntity,
} from './entity/productPrice.entity';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

@Injectable()
export class ProductPriceRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  async findMany(productIds: number[]) {
    return (await this.txHost.tx.getRepository(ProductPriceEntity).find({
      where: {
        productId: In(productIds),
      },
    })) as PersistedProductPriceEntity[];
  }
}
