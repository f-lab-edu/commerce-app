import { Injectable } from '@nestjs/common';
import { ProductRepository, Range } from './product.repository';
import { OrderItemsInput } from '../order/dto/order.dto';
import { PersistedProductEntity } from './entity/product.entity';
import { Map } from './productPrice.service';
import { ProductStockException } from '../common/exception/product.exception';

type ProductMap = Map<PersistedProductEntity>;
@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getPopularTopK(limit: number, month: number, price: Range) {
    return await this.productRepository.getPopularTopK(limit, month, price);
  }
  async validateStocks(orderItems: OrderItemsInput[]) {
    const productIds = orderItems.map((oi) => oi.productId);
    const products = await this.productRepository.findMany(productIds);
    const productMap = this.generateProductMap(products);

    const checkIfOrderItemsHasMoreStock = (oi: OrderItemsInput) =>
      oi.quantity > productMap[oi.productId].stocks;

    const overOrderedItems = orderItems.filter(checkIfOrderItemsHasMoreStock);
    if (overOrderedItems.length > 0) {
      throw new ProductStockException({
        clientMsg: `${overOrderedItems
          .map((oi) => productMap[oi.productId].name)
          .join(', ')}재고가 맞지 않습니다.`,
        devMsg: `재고가 맞지 않는 상품 아이디. ${overOrderedItems.map((oi) => oi.productId).join(', ')}`,
      });
    }
  }

  async decreaseStocks(orderItems: OrderItemsInput[]) {
    return await this.productRepository.decreaseStocks(orderItems);
  }

  private generateProductMap(
    products: (PersistedProductEntity | null)[],
  ): ProductMap {
    return products.filter(Boolean).reduce((prev, cur) => {
      if (cur) {
        prev[cur.id] = cur;
      }
      return prev;
    }, {});
  }
}
