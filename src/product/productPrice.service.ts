import { Injectable } from '@nestjs/common';
import { OrderDetailInputs } from '../order/dto/order.dto';
import { ProductPriceDataAccess } from './productPrice.repository';
import { PersistedProductPriceEntity } from './entity/productPrice.entity';

@Injectable()
export class ProductPriceService {
  constructor(
    private readonly productPriceDataAccess: ProductPriceDataAccess,
  ) {}

  async validateOrderProductsPrice(orderItems: OrderDetailInputs[]) {
    const productIds = orderItems.map((orderItem) => orderItem.productId);
    const productPrices = await Promise.all(
      productIds.map((id) => this.productPriceDataAccess.findById(id)),
    );
    const productPriceMap = this.generateProductMap(productPrices);

    this.validateProductExistence(orderItems, productPriceMap);
    this.validateUnitPrice(orderItems, productPriceMap);
    this.validateSubtotal(orderItems, productPriceMap);
  }

  private generateProductMap(
    productPrices: (PersistedProductPriceEntity | null)[],
  ): Record<number, PersistedProductPriceEntity> {
    return productPrices.filter(Boolean).reduce((prev, cur) => {
      if (cur) {
        prev[cur.id] = cur;
      }
      return prev;
    }, {});
  }

  private validateProductExistence(
    orderItems: OrderDetailInputs[],
    priceMap: Record<number, PersistedProductPriceEntity>,
  ) {
    return orderItems.every((item) => priceMap[item.productId] !== undefined);
  }

  private validateUnitPrice(
    orderItems: OrderDetailInputs[],
    priceMap: Record<number, PersistedProductPriceEntity>,
  ) {
    return orderItems.every(
      (item) => item.unitPrice === priceMap[item.productId].price,
    );
  }

  private validateSubtotal(
    orderItems: OrderDetailInputs[],
    priceMap: Record<number, PersistedProductPriceEntity>,
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
}
