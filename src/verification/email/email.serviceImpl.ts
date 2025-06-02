import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerificationEntity } from '../entity/emailVerification.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { VeriService } from '../services/veri.service';
import { VeriCodeVO } from '../vo/code.vo';
import { UserEmailVO } from '../../user/vo/email.vo';

@Injectable()
export class EmailServiceImpl implements VeriService {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: Repository<EmailVerificationEntity>,
    private readonly configService: ConfigService,
  ) {}
  sendCode: (to: UserEmailVO) => Promise<VeriCodeVO>;
}
