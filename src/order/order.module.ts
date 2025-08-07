import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { JwtPipe } from '../common/pipe/jwt.pipe';
import { OrderRequestEntity } from './entity/orderRequest.entity';
import { OrderRequestService } from './orderRequest.service';
import { ProductPriceDataAccess } from '../product/productPrice.repository';
import { ProductPriceService } from '../product/productPrice.service';
import { ProductPriceEntity } from '../product/entity/productPrice.entity';
import { OrderPolicyService } from './policy/order.policy';
import { OrderRepository } from './order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderRequestEntity,
      ProductPriceEntity,
    ]),
  ],
  providers: [
    OrderService,
    OrderPolicyService,
    OrderRequestService,
    JwtPipe,
    OrderRepository,
    ProductPriceDataAccess,
    ProductPriceService,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
