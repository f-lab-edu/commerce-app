import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CommonConstraints } from '../../common/entity/base.constraints';

export const IDEMPOTENCY_STATUS = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

type IdempotencyStatus = typeof IDEMPOTENCY_STATUS;
export type TIdempotencyStatus = IdempotencyStatus[keyof IdempotencyStatus];

@Entity('idempotency_keys')
export class IdempotencyKeyEntity {
  @PrimaryColumn()
  idempotencyKey: string;

  @Column({ type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER })
  userId: number;

  @Column({
    type: 'enum',
    default: IDEMPOTENCY_STATUS.PROCESSING,
    enum: IDEMPOTENCY_STATUS,
  })
  status: TIdempotencyStatus;

  @Column({ type: 'json' })
  responseBody: Record<string, string>;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime' })
  updatedAt: Date;

  @Column({ type: 'datetime' })
  expiresAt: Date;
}
