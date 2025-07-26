import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CommonConstraints } from '../../common/entity/base.constraints';
import { z } from 'zod';
import { InternalException } from '../../common/exception/internal.exception';

export const IDEMPOTENCY_STATUS = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

type IdempotencyStatus = typeof IDEMPOTENCY_STATUS;
export type TIdempotencyStatus = IdempotencyStatus[keyof IdempotencyStatus];

const IdempotencyKeySchema = z.object({
  idempotencyKey: z.string(),
  status: z.enum(Object.keys(IDEMPOTENCY_STATUS)),
  userId: z.number(),
  hashedPayload: z.string(),
  responseBody: z.json(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  expiresAt: z.date(),
});

type IIdempotencyKeyEntity = z.infer<typeof IdempotencyKeySchema>;
type IdempotencyKeyInput = Omit<
  IIdempotencyKeyEntity,
  'createdAt' | 'updatedAt' | 'status'
>;

@Entity('idempotency_keys')
export class IdempotencyKeyEntity implements IIdempotencyKeyEntity {
  @PrimaryColumn({
    type: CommonConstraints.DB_CONSTRAINTS.BASIC_STRING,
  })
  idempotencyKey: string;

  @Column({ type: CommonConstraints.DB_CONSTRAINTS.BASIC_NUMBER })
  userId: number;

  @Column({
    type: 'enum',
    default: IDEMPOTENCY_STATUS.PROCESSING,
    enum: IDEMPOTENCY_STATUS,
  })
  status: TIdempotencyStatus;

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

  // constructor를 비공개로 하고 객체 생성로직을 팩토리 함수로 작성하고 싶어도
  // typeorm은 엔터티를 초기화할때 생성자를 사용하므로 생성자를 공개할 수 밖에 없음
  // 복잡한 로직을 팩토리함수에 작성하고, 생성자에는 간단한 로직만 남겨둬도
  // 생성자로 초기화하는 실수를 할 수 있기때문에, 생성자에 로직을 뒀습니다.
  constructor(param: IdempotencyKeyInput) {
    try {
      const safeParsedParam = IdempotencyKeySchema.parse(param);
      Object.assign(this, safeParsedParam);
    } catch (error) {
      throw new InternalException({
        clientMsg: '서버에 문제가 생겼습니다 다시 시도해 주세요. ',
        devMsg: `${JSON.stringify(error)}`,
      });
    }
  }
}
