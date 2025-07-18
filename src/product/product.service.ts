import { Injectable } from '@nestjs/common';
import { ProductDataAccess, Range } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private productDataAccess: ProductDataAccess) {}

  async getPopularTopK(limit: number, month: number, price: Range) {
    return await this.productDataAccess.getPopularTopK(limit, month, price);
  }
}
