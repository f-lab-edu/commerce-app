import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  @Get('/popular')
  async getPopular(
    @Query('limit') limit: string,
    @Query('month') month: string,
    @Query('priceFrom') priceFrom: string,
    @Query('priceTo') priceTo: string,
  ) {
    return await this.productService.getPopularTopK(limit, month, {
      from: priceFrom,
      to: priceTo,
    });
  }
}
