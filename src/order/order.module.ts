import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderController } from './order.controller';
import { IdempotencyKeyEntity } from './entity/idempotency.entity';
import { OrderService } from './order.service';
import { IdempotencyService } from './idempotency.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, IdempotencyKeyEntity])],
  providers: [OrderService, IdempotencyService],
  controllers: [OrderController],
})
export class OrderModule {}
