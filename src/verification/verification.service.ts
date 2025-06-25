import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EmailVerificationEntity,
  PersistedEmailVerificationEntity,
} from './entity/emailVerification.entity';
import { Repository } from 'typeorm';
import { CreateVeriCommand } from './vo/saveCode.command';
import { UpdateVeriCommand } from './command/updateVeri.command';
import { UserEmailVO } from '../user/vo/email.vo';
import { VERIFICATION_STATUS } from './entity/types';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private verificationRepository: Repository<PersistedEmailVerificationEntity>,
  ) {}

  async saveVeriSendInfo(createVeriCommand: CreateVeriCommand) {
    return await this.verificationRepository.save(createVeriCommand);
  }

  async updateVeriInfo(updateVeriCommand: UpdateVeriCommand) {
    const { id, ...newData } = updateVeriCommand;

    return await this.verificationRepository.update(id, { ...newData });
  }

  async hasStillValidVeri(email: UserEmailVO) {
    const results = await this.verificationRepository.find({
      where: {
        email,
        status: VERIFICATION_STATUS.PENDING,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 1,
    });

    const doesNotExit = results.length === 0;
    if (doesNotExit) {
      return false;
    }

    const veriEntity = results[0];
    const currentTime = new Date();

    return (
      veriEntity.status === VERIFICATION_STATUS.PENDING &&
      currentTime < veriEntity.expiredAt
    );
  }
}
