import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SignUpDto } from '../auth/dto/signup.dto';
import { UserMapper } from './dto/user.mapper';
import { UserService, UserServiceToken } from './service/user.service';

@Controller('user')
export class UserController {
  constructor() {}
}
