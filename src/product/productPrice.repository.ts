import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PersistedProductPriceEntity,
  ProductPriceEntity,
} from './entity/productPrice.entity';

@Injectable()
export class ProductPriceDataAccess {
  constructor(
    @InjectRepository(ProductPriceEntity)
    private readonly productPriceRepository: Repository<PersistedProductPriceEntity>,
  ) {}

  async findById(id: number) {
    return await this.productPriceRepository.findOne({
      where: { productId: id },
    });
  }
}
