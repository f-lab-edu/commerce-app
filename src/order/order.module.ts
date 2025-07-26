import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderController } from './order.controller';
import { IdempotencyKeyEntity } from './entity/idempotency.entity';
import { OrderService } from './order.service';
import { IdempotencyService } from './idempotency.service';
import { JwtPipe } from '../common/pipe/jwt.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, IdempotencyKeyEntity])],
  providers: [OrderService, IdempotencyService, JwtPipe],
  controllers: [OrderController],
})
export class OrderModule {}
