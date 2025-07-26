import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IDEMPOTENCY_STATUS,
  IdempotencyKeyEntity,
} from './entity/idempotency.entity';
import { Repository } from 'typeorm';
import { OrderDto } from './dto/order.dto';
import { createHash } from 'crypto';
import {
  ConflictRequestException,
  UnprocessableException,
} from '../common/exception/idempotency.exception';

@Injectable()
export class IdempotencyService {
  constructor(
    @InjectRepository(IdempotencyKeyEntity)
    private readonly idempotencyRepository: Repository<IdempotencyKeyEntity>,
  ) {}

  async find(key: string): Promise<IdempotencyKeyEntity | null> {
    return await this.idempotencyRepository.findOne({
      where: { idempotencyKey: key },
    });
  }

  checkIfCanMakeOrder(
    idempotencyKeyEntity: IdempotencyKeyEntity | null,
    payload: OrderDto,
  ) {
    this.checkIfProcessing(idempotencyKeyEntity);
    this.isDifferentReqDetailWithSameKey(idempotencyKeyEntity, payload);
  }

  private checkIfProcessing(idempotencyKeyEntity: IdempotencyKeyEntity | null) {
    if (
      this.hasPreviousReq(idempotencyKeyEntity) &&
      idempotencyKeyEntity.status === IDEMPOTENCY_STATUS.PROCESSING
    ) {
      throw new ConflictRequestException({
        clientMsg: '진행중인 주문이 있습니다. 잠시만 기다려주세요',
        devMsg: `진행중인 주문 키: ${idempotencyKeyEntity.idempotencyKey}`,
      });
    }
  }
  private isDifferentReqDetailWithSameKey(
    idempotencyKeyEntity: IdempotencyKeyEntity | null,
    payload: OrderDto,
  ) {
    const hashedIncomingPayload = this.hashPayload(payload);

    if (
      this.hasPreviousReq(idempotencyKeyEntity) &&
      idempotencyKeyEntity.hashedPayload != hashedIncomingPayload
    ) {
      throw new UnprocessableException({
        clientMsg: '주문정보가 일치하지 않습니다. 다시 시도해주세요',
        devMsg: `동일한 주문키: ${idempotencyKeyEntity.idempotencyKey}로 다른 요청이 들어왔습니다.`,
      });
    }
  }

  private hasPreviousReq(idempotencyKeyEntity: IdempotencyKeyEntity | null) {
    return idempotencyKeyEntity !== null;
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

  async save(param: {
    key: string;
    orderDto: OrderDto;
    userId: number;
    response: any;
  }) {
    const { key, orderDto, response, userId } = param;
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    const entity = new IdempotencyKeyEntity({
      userId,
      responseBody: response,
      hashedPayload: this.hashPayload(orderDto),
      idempotencyKey: key,
      expiresAt: threeDaysLater,
    });

    await this.idempotencyRepository.save(entity);
  }
}
