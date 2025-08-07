import { ClsService } from 'nestjs-cls';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { TRANSACTION_MANAGER } from '../decorator/transaction.decorator';

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(
    protected readonly clsService: ClsService,
    protected readonly dataSource: DataSource,
  ) {}
  protected getManager(): EntityManager {
    return this.clsService.get(TRANSACTION_MANAGER) ?? this.dataSource.manager;
  }

  protected getRepository(entity: EntityTarget<T>): Repository<T> {
    return this.getManager().getRepository(entity);
  }

  save(entity: T | T[]) {
    const entityConstructor = Array.isArray(entity)
      ? entity[0].constructor
      : entity.constructor;
    return this.getRepository(entityConstructor).save(entity as any);
  }
}
