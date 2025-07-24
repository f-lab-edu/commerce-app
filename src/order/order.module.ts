import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderController } from './order.controller';
import { IdempotencyKeyEntity } from './entity/idempotency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, IdempotencyKeyEntity])],
  controllers: [OrderController],
})
export class OrderModule {}
