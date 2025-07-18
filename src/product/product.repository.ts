import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersistedProductEntity, ProductEntity } from './entity/product.entity';
import { Repository } from 'typeorm';
import { OrderDetailEntity } from '../orderDetail/entity/orderDetail.entity';

export type Range = {
  min: number;
  max: number;
};

@Injectable()
export class ProductDataAccess {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<PersistedProductEntity>,
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
    const popularTopProducts = await this.productRepository
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
}
