import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { finalize, Observable, Subscriber, tap, TeardownLogic } from 'rxjs';
import { DataSource } from 'typeorm';

export const TRANSACTION_MANAGER = 'TRANSACTION_MANAGER';

/**
 * 트랜잭션이 필요한 메소드에 사용하는 데코레이터
 *
 * @example
 * ```typescript
 * \@Transactional()
 * async doSomething(param: ParamType) { ... }
 * ```
 */
export const Transactional = Reflector.createDecorator<boolean>({
  transform: () => true,
});

/**
 * APP 모듈에 사용되는 트랜잭션용 전역 인터셉터
 * 메타 데이터를 확인해 트랜잭션용 엔터티 매니저를 생성
 */
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
    private readonly clsService: ClsService,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const isTransactional = this.reflector.get(
      Transactional,
      context.getHandler(),
    );
    if (!isTransactional) {
      return next.handle();
    }

    const queryRunner = this.dataSource.createQueryRunner();

    const transactionContext = async (subscriber: Subscriber<any>) => {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      this.clsService.set(TRANSACTION_MANAGER, queryRunner.manager);

      next
        .handle()
        .pipe(
          tap({
            next: async () => {
              await queryRunner.commitTransaction();
            },
            error: async (error) => {
              console.error(error);
              await queryRunner.rollbackTransaction();
            },
          }),
          finalize(async () => {
            await queryRunner.release();
          }),
        )
        .subscribe({
          next: (data) => subscriber.next(data),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete(),
        });
    };

    const transactionWrapper = (subscriber: Subscriber<any>) => {
      this.clsService.run(async () => await transactionContext(subscriber));
    };

    return new Observable(transactionWrapper);
  }
}
