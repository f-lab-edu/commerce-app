import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import {
  PersistedProductPriceEntity,
  ProductPriceEntity,
} from './entity/productPrice.entity';
import { BaseRepository } from '../common/repository/base.repository';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class ProductPriceRepository extends BaseRepository<PersistedProductPriceEntity> {
  constructor(
    protected readonly clsService: ClsService,
    protected readonly dataSource: DataSource,
  ) {
    super(clsService, dataSource);
  }

  async findMany(productIds: number[]) {
    return await this.getRepository(ProductPriceEntity).find({
      where: {
        productId: In(productIds),
      },
    });
  }
}
