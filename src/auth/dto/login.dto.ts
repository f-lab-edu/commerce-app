import { PickType } from '@nestjs/swagger';
import { SignUpDto } from './signup.dto';

export class LoginDto extends PickType(SignUpDto, ['email', 'password']) {}
