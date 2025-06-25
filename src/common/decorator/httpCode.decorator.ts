import { HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * 커스텀 예외 클래스와 HTTP 상태코드를 매핑하기 위해 사용되는 데코레이터입니다.
 * 커스텀 예외 클래스를 특정 프로토콜에 종속시키지 않게 하기 위해서 사용합니다.
 * 런타임에 HTTP 상태 코드를 핸들링하는 Filter에서 예외를 캐치해서 적절한 상태코드를
 * 결정할 수 있도록 메타데이터를 제공합니다.
 *
 * @param status - HttpStatus
 * @example
 * ```typescript
 * '@HttpStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)'
 * export class VerificationCodeSendException extends VerificationException {
 *  constructor(message: string) {
 *   super(message);
 *  }
 * }
 * ```
 */
export const HttpStatusCode = Reflector.createDecorator<HttpStatus>();
