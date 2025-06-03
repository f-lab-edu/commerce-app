import { BadRequestException } from '@nestjs/common';

export interface IPolicyService<T> {
  validate(dto: T): Promise<void>;
}

export abstract class BasePolicyService<T> implements IPolicyService<T> {
  protected validationTarget: T;

  #init(data: T): void {
    if (!data) {
      throw new BadRequestException(
        `유효성 검사를 위한 데이터가 입력되지 않았습니다. ${this.validate.name}에 올바른 데이터를 입력해 주시길 바랍니다.`,
      );
    }
    this.validationTarget = data;
  }

  protected abstract executeValidationRules(): Promise<void>;

  async validate(dto: T) {
    this.#init(dto);
    await this.executeValidationRules();
  }
}
