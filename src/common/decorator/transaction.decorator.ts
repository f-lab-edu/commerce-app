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
export const Transactional = Reflector.createDecorator<boolean>({
  transform: () => true,
});

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
