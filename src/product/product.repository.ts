import { Injectable } from '@nestjs/common';
import { PersistedProductEntity, ProductEntity } from './entity/product.entity';
import { In } from 'typeorm';
import { OrderDetailEntity } from '../orderDetail/entity/orderDetail.entity';
import { OrderItemsInput } from '../order/dto/order.dto';
import { ProductUpdateException } from '../common/exception/product.exception';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

export type Range = {
  min: number;
  max: number;
};

@Injectable()
export class ProductRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  /**
   *
   * @param limit 상위 k 개의 제품으로 제한합니다.
   * @param month 최근 m 개월을 판매된 상품으로 제한합니다.
   * @param price 가격의 범위를 제한합니다.
   * @returns 판매량 순위별 제품 정보 배열
   *    - id: 제품 ID
   *    - name: 제품명
   *    - totalQuantity: 총 판매 수량
   *    - salesRank: 판매량 순위 (1부터 시작)
   */
  async getPopularTopK(limit: number, month: number, price: Range) {
    const popularTopProducts = await this.txHost.tx
      .getRepository(ProductEntity)
      .createQueryBuilder('p')
      .select([
        'p.id AS id',
        'p.name as name',
        'SUM(od.quantity) as totalQuantity',
        'DENSE_RANK() OVER (ORDER BY SUM(od.quantity) DESC) as salesRank',
      ])
      .innerJoin(OrderDetailEntity, 'od', 'od.productId = p.id')
      .where('p.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: price.min,
        maxPrice: price.max,
      })
      .andWhere('od.createdAt >= DATE_SUB(NOW(), INTERVAL :month MONTH)', {
        month,
      })
      .groupBy('p.id, p.name')
      .orderBy('totalQuantity', 'DESC')
      .limit(limit)
      .getRawMany();

    return popularTopProducts;
  }

  async findMany(productIds: number[]) {
    const products = await this.txHost.tx.getRepository(ProductEntity).find({
      where: {
        id: In(productIds),
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });
    return products as PersistedProductEntity[];
  }

  async decreaseStocks(orderItems: OrderItemsInput[]) {
    const updateQuries = orderItems.map((oi) =>
      this.txHost.tx
        .getRepository(ProductEntity)
        .createQueryBuilder()
        .update()
        .set({
          stocks: () => `stocks - ${oi.quantity}`,
        })
        .where(`id = :productId`, { productId: oi.productId })
        .andWhere(`stocks >= :quantity`, { quantity: oi.quantity })
        .execute(),
    );
    const result = await Promise.all(updateQuries);
    const affectedRows = result
      .map((r) => r.affected!)
      .reduce((prev, cur) => prev + cur, 0);

    if (orderItems.length !== affectedRows) {
      throw new ProductUpdateException({
        clientMsg:
          '재고 업데이트에 문제가 발생했습니다. 다시 한번 시도해 주시길 바랍니다.',
      });
    }
  }

  async save(entity: unknown) {
    return (await this.txHost.tx.save(entity)) as PersistedProductEntity[];
  }
}
