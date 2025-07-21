import { HttpStatus } from '@nestjs/common';
import { HttpStatusCode } from '../decorator/httpCode.decorator';
import { CustomException } from './service.exception';

export class InternalException extends CustomException {}

@HttpStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
export class ConfigException extends InternalException {}
