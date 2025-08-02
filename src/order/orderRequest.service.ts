import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ORDER_REQUEST_STATUS,
  OrderRequestEntity,
} from './entity/orderRequest.entity';
import { Repository } from 'typeorm';
import { OrderDto } from './dto/order.dto';
import { createHash } from 'crypto';
import {
  ConflictRequestException,
  UnprocessableException,
} from '../common/exception/orderRequest.exception';

@Injectable()
export class OrderRequestService {
  constructor(
    @InjectRepository(OrderRequestEntity)
    private readonly orderRequestRepository: Repository<OrderRequestEntity>,
  ) {}

  async find(orderRequestId: string): Promise<OrderRequestEntity | null> {
    return await this.orderRequestRepository.findOne({
      where: { id: orderRequestId },
    });
  }

  validateOrderRequestStatus(
    orderRequest: OrderRequestEntity | null,
    payload: OrderDto,
  ) {
    this.checkIfProcessing(orderRequest);
    this.isDifferentReqDetailWithSameKey(orderRequest, payload);
  }

  private checkIfProcessing(orderRequest: OrderRequestEntity | null) {
    if (
      this.hasPreviousReq(orderRequest) &&
      orderRequest.status === ORDER_REQUEST_STATUS.PROCESSING
    ) {
      throw new ConflictRequestException({
        clientMsg: '진행중인 주문이 있습니다. 잠시만 기다려주세요',
        devMsg: `진행중인 주문 키: ${orderRequest.id}`,
      });
    }
  }
  private isDifferentReqDetailWithSameKey(
    orderRequest: OrderRequestEntity | null,
    payload: OrderDto,
  ) {
    const hashedIncomingPayload = this.hashPayload(payload);

    if (
      this.hasPreviousReq(orderRequest) &&
      orderRequest.hashedPayload != hashedIncomingPayload
    ) {
      throw new UnprocessableException({
        clientMsg: '주문정보가 일치하지 않습니다. 다시 시도해주세요',
        devMsg: `동일한 주문키: ${orderRequest.id}로 다른 요청이 들어왔습니다.`,
      });
    }
  }

  private hasPreviousReq(orderRequest: OrderRequestEntity | null) {
    return orderRequest !== null;
  }

  private hashPayload(payload: OrderDto) {
    const sortedPayload = Object.keys(payload)
      .sort()
      .reduce((obj, key) => {
        obj[key] = payload[key];

        return obj;
      }, {});

    const payloadString = JSON.stringify(sortedPayload);
    return createHash('sha256').update(payloadString).digest('hex');
  }

  async save(
    param: Pick<OrderRequestEntity, 'id' | 'userId' | 'responseBody'> & {
      orderDto: OrderDto;
    },
  ) {
    const { id, orderDto, responseBody, userId } = param;
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const entity = OrderRequestEntity.create({
      userId,
      responseBody,
      hashedPayload: this.hashPayload(orderDto),
      id,
      expiresAt: threeDaysLater,
    });

    await this.orderRequestRepository.save(entity);
  }
}
