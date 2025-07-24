import { CustomException } from './service.exception';

export abstract class IdempotencyException extends CustomException {}
