import { HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const HttpStatusCode = Reflector.createDecorator<HttpStatus>();
