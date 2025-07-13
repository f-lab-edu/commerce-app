import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersistedProductEntity, ProductEntity } from './entity/product.entity';
import { Repository } from 'typeorm';

type Range = {
  from: string;
  to: string;
};

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<PersistedProductEntity>,
  ) {}

  async getPopularTopK(limit: string, month: string, price: Range) {
    return await this.productRepository.query(
      `SELECT p.id, p.name, sum(od.quantity) AS total_quantity
        FROM products as p
        JOIN
            order_details AS od ON p.id = od.productId
        JOIN
            orders AS o ON o.id = od.productId
        WHERE
            p.price >= ? AND p.price <= ?
            AND o.createdAt >= DATE_SUB(NOW(), INTERVAL ? MONTH )
        GROUP BY
            p.id, p.name
        ORDER BY
            total_quantity DESC
        LIMIT ?
        `,
      [price.from, price.to, month, limit],
    );
  }
}
