import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  @Get('popular')
  async getPopular(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('minPrice', ParseIntPipe) minPrice: number,
    @Query('maxPrice', ParseIntPipe) maxPrice: number,
  ) {
    return await this.productService.getPopularTopK(limit, month, {
      min: minPrice,
      max: maxPrice,
    });
  }
}
