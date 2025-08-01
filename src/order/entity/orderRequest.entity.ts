import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CommonConstraints } from '../../common/entity/base.constraints';
import { z } from 'zod';
import { InternalException } from '../../common/exception/internal.exception';

export const ORDER_REQUEST_STATUS = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

type OrderRequestStatus = typeof ORDER_REQUEST_STATUS;
export type TOrderRequestStatus = OrderRequestStatus[keyof OrderRequestStatus];

const OrderRequestSchema = z.object({
  id: z.string(),
  status: z
    .enum(Object.values(ORDER_REQUEST_STATUS))
    .default(ORDER_REQUEST_STATUS.PROCESSING),
  userId: z.number(),
  hashedPayload: z.string(),
  responseBody: z.json(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  expiresAt: z.date(),
});

type IOrderRequestEntity = z.infer<typeof OrderRequestSchema>;
type IOrderRequestInput = Omit<
  IOrderRequestEntity,
  'createdAt' | 'updatedAt' | 'status'
>;

@Entity('order_requests')
export class OrderRequestEntity implements IOrderRequestEntity {
  @PrimaryColumn({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
  })
  id: string;

  @Column({ type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER })
  userId: number;

  @Column({
    type: 'enum',
    default: ORDER_REQUEST_STATUS.PROCESSING,
    enum: ORDER_REQUEST_STATUS,
  })
  status: TOrderRequestStatus;

  @Column({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
  })
  hashedPayload: string;

  @Column({ type: 'json' })
  responseBody: Record<string, string>;

  @Column({ type: 'datetime' })
  createdAt?: Date;

  @Column({ type: 'datetime' })
  updatedAt?: Date;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  private constructor() {}

  static create(param: IOrderRequestInput) {
    const safeParsedParam = OrderRequestSchema.parse(param);
    const entity = new OrderRequestEntity();
    Object.assign(entity, safeParsedParam);
    return entity;
  }
}
