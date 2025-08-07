import { Injectable } from '@nestjs/common';
import { OrderDetailInputs, OrderDto } from '../order/dto/order.dto';
import { ProductPriceDataAccess } from './productPrice.repository';
import { PersistedProductPriceEntity } from './entity/productPrice.entity';
import { ClientOrderInfoException } from '../common/exception/product.exception';
import { BasicClientOrderInfoException } from '../order/policy/order.policy';

type PriceMap = Record<number, PersistedProductPriceEntity>;
@Injectable()
export class ProductPriceService {
  constructor(
    private readonly productPriceDataAccess: ProductPriceDataAccess,
  ) {}

  async validateOrderProductsPrice(orderDto: OrderDto) {
    const { orderItems } = orderDto;
    const productIds = orderItems.map((orderItem) => orderItem.productId);
    const productPrices = await Promise.all(
      productIds.map((id) => this.productPriceDataAccess.findById(id)),
    );
    const productPriceMap = this.generateProductMap(productPrices);

    const validationRules = [
      this.validateProductExistence(orderItems, productPriceMap),
      this.validateUnitPrice(orderItems, productPriceMap),
      this.validateSubtotal(orderItems, productPriceMap),
      this.validateOrderSubtotal(orderDto.subtotal, productPriceMap),
    ];

    const validationResult = validationRules.every(Boolean);
    if (!validationResult) {
      throw BasicClientOrderInfoException;
    }
  }

  private generateProductMap(
    productPrices: (PersistedProductPriceEntity | null)[],
  ): PriceMap {
    return productPrices.filter(Boolean).reduce((prev, cur) => {
      if (cur) {
        prev[cur.id] = cur;
      }
      return prev;
    }, {});
  }

  private validateProductExistence(
    orderItems: OrderDetailInputs[],
    priceMap: PriceMap,
  ) {
    return orderItems.every((item) => priceMap[item.productId] !== undefined);
  }

  private validateUnitPrice(
    orderItems: OrderDetailInputs[],
    priceMap: PriceMap,
  ) {
    return orderItems.every(
      (item) => item.unitPrice === priceMap[item.productId].price,
    );
  }

  private validateSubtotal(
    orderItems: OrderDetailInputs[],
    priceMap: PriceMap,
  ) {
    const validate = (item: OrderDetailInputs) => {
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

  private validateOrderSubtotal(clientSubtotal: number, priceMap: PriceMap) {
    const subtotalByServerPrice = Object.values(priceMap).reduce(
      (prev, p) => prev + p.price,
      0,
    );

    return clientSubtotal === subtotalByServerPrice;
  }
}
