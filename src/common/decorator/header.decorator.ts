import { Reflector } from '@nestjs/core';

export const ResponseHeader = Reflector.createDecorator<Record<string, any>>();
