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

  // 재고 검증과 재고 차감 순서를 강제합니다.
  async validateAndDecreaseStocks(
    orderItems: OrderItemsInput[],
  ): Promise<PersistedProductEntity[]> {
    const products = await this.validateStocks(orderItems);
    return await this.decreaseStocks(orderItems, products);
  }

  private async validateStocks(
    orderItems: OrderItemsInput[],
  ): Promise<PersistedProductEntity[]> {
    const productIds = orderItems.map((oi) => oi.productId);
    const products = await this.productRepository.findMany(productIds);
    const productMap = this.generateProductMap(products);

    const checkIfOverOrdered = (oi: OrderItemsInput) =>
      oi.quantity > productMap[oi.productId].stocks;

    const overOrderedItems = orderItems.filter(checkIfOverOrdered);
    if (overOrderedItems.length > 0) {
      throw new ProductStockException({
        clientMsg: `${overOrderedItems
          .map((oi) => productMap[oi.productId].name)
          .join(', ')}는 주문수량이 재고보다 많습니다.`,
        devMsg: `주문수량과 재고가 맞지 않는 주문상품 아이디. ${overOrderedItems.map((oi) => oi.productId).join(', ')}`,
      });
    }

    return products;
  }

  private async decreaseStocks(
    orderItems: OrderItemsInput[],
    products: PersistedProductEntity[],
  ): Promise<PersistedProductEntity[]> {
    const productsMap = this.generateProductMap(products);
    const productsWithDecreasedStocks = orderItems.map((oi) => {
      const product = productsMap[oi.productId];
      product.stocks -= oi.quantity;
      return product;
    });

    return await this.productRepository.save(productsWithDecreasedStocks);
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
