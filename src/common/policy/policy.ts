import { BadRequestException } from '@nestjs/common';

export interface IPolicyService<T> {
  validate(dto: T): Promise<void>;
}

export abstract class BasePolicyService<T> implements IPolicyService<T> {
  protected validationTarget: T;

  #init(data: T): void {
    if (!data) {
      throw new BadRequestException('유효성 검사를 위한 데이터가 없습니다.');
    }
    this.validationTarget = data;
  }

  protected abstract executeValidationRules(): Promise<void>;

  async validate(dto: T) {
    this.#init(dto);
    await this.executeValidationRules();
  }
}
