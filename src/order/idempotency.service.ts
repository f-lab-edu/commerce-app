import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IDEMPOTENCY_STATUS,
  IdempotencyKeyEntity,
} from './entity/idempotency.entity';
import { Repository } from 'typeorm';

import { OrderCommand } from './command/order.command';
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
    this.isProcessable(idempotencyKeyEntity, payload);
  }

  private hasPreviousReq(idempotencyKeyEntity: IdempotencyKeyEntity | null) {
    return idempotencyKeyEntity !== null;
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
  private isProcessable(
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
        devMsg: `주문키: ${idempotencyKeyEntity.idempotencyKey}`,
      });
    }
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
}
