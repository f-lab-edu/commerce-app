import { Injectable } from '@nestjs/common';
import { OrderItemsInput, OrderDto } from '../order/dto/order.dto';
import { PersistedProductPriceEntity } from './entity/productPrice.entity';
import { ProductPriceRepository } from './productPrice.repository';
import { ClientOrderInfoException } from '../common/exception/product.exception';

export type Map<T> = Record<number, T>;
type PriceMap = Map<PersistedProductPriceEntity>;
@Injectable()
export class ProductPriceService {
  constructor(
    private readonly productPriceRepository: ProductPriceRepository,
  ) {}

  async validateOrderProductsPrice(orderDto: OrderDto) {
    const { orderItems } = orderDto;
    const productIds = orderItems.map((orderItem) => orderItem.productId);
    const productPrices =
      await this.productPriceRepository.findMany(productIds);
    const productPriceMap = this.generateProductMap(productPrices);

    const validationRules = [
      this.validateProductExistence(orderItems, productPriceMap),
      this.validateUnitPrice(orderItems, productPriceMap),
      this.validateSubtotal(orderItems, productPriceMap),
      this.validateOrderSubtotal(
        orderDto.subtotal,
        productPriceMap,
        orderItems,
      ),
    ];

    const validationResult = validationRules.every(Boolean);
    if (!validationResult) {
      throw new ClientOrderInfoException();
    }
  }

  private generateProductMap(
    productPrices: (PersistedProductPriceEntity | null)[],
  ): PriceMap {
    return productPrices.filter(Boolean).reduce((prev, cur) => {
      if (cur) {
        prev[cur.productId] = cur;
      }
      return prev;
    }, {});
  }

  private validateProductExistence(
    orderItems: OrderItemsInput[],
    priceMap: PriceMap,
  ) {
    return orderItems.every((item) => priceMap[item.productId] !== undefined);
  }

  private validateUnitPrice(orderItems: OrderItemsInput[], priceMap: PriceMap) {
    return orderItems.every(
      (item) => item.unitPrice === priceMap[item.productId].price,
    );
  }

  private validateSubtotal(orderItems: OrderItemsInput[], priceMap: PriceMap) {
    const validate = (item: OrderItemsInput) => {
      const wrongSubtotalByItemPrice =
        item.subtotal != item.quantity * item.unitPrice;
      if (wrongSubtotalByItemPrice) {
        return false;
      }

      const wrongSubtotalBySystemPrice =
        item.subtotal !== item.quantity * priceMap[item.productId].price;
      if (wrongSubtotalBySystemPrice) {
        return false;
      }

      return true;
    };

    return orderItems.every(validate);
  }

  private validateOrderSubtotal(
    clientSubtotal: number,
    priceMap: PriceMap,
    orderItems: OrderItemsInput[],
  ) {
    const quantityMap = orderItems.reduce((prev, cur) => {
      prev[cur.productId] = cur.quantity;
      return prev;
    }, {});
    const subtotalByServerPrice = Object.values(priceMap).reduce(
      (prev, p) => prev + p.price * quantityMap[p.productId],
      0,
    );

    return clientSubtotal === subtotalByServerPrice;
  }
}
