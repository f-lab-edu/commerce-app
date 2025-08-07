import { Injectable } from '@nestjs/common';
import { ProductRepository, Range } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getPopularTopK(limit: number, month: number, price: Range) {
    return await this.productRepository.getPopularTopK(limit, month, price);
  }
}
