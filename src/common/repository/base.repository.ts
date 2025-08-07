import { ClsService } from 'nestjs-cls';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { TRANSACTION_MANAGER } from '../decorator/transaction.decorator';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  constructor(
    protected readonly clsService: ClsService,
    protected readonly dataSource: DataSource,
    protected readonly entity: EntityTarget<T>,
  ) {
    super(entity, dataSource.createEntityManager());
  }
  protected getManager(): EntityManager {
    return this.clsService.get(TRANSACTION_MANAGER) ?? this.manager;
  }
}
