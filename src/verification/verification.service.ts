import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EmailVerificationEntity,
  PersistedEmailVerificationEntity,
} from './entity/emailVerification.entity';
import {
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateVeriCommand } from './vo/saveCode.command';
import { UpdateVeriCommand } from './command/updateVeri.command';
import { UserEmailVO } from '../user/vo/email.vo';
import { VERIFICATION_STATUS } from './entity/types';
import { VERIFICATION_CHANNELS } from './command/sendCode.command';

// 인증정보는 SMS와 UserEmailVo롤 가질 수 있음
// 추후 type To = UserEmailVO | UserPhoneNumberVO 가능

export type EmailContact = {
  to: UserEmailVO;
  channel?: (typeof VERIFICATION_CHANNELS)['email'];
};

type PhoneContact = {
  to: string;
  channel: (typeof VERIFICATION_CHANNELS)['sms'];
};

type VerificationContact = EmailContact | PhoneContact;

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private verificationRepository: Repository<PersistedEmailVerificationEntity>,
  ) {}

  async findLatestPendingVeri(email: UserEmailVO) {
    return await this.verificationRepository.findOne({
      where: {
        email,
        status: VERIFICATION_STATUS.PENDING,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

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

  async isVerified(verificationContact: VerificationContact) {
    const oneMin = 60 * 1000;
    const tenMinAgo = new Date(Date.now() - oneMin * 10);
    const { channel, to } = verificationContact;

    // typeORM 조건문
    let where;

    // 우선 이메일 대해서만 조건문 구현
    if (channel === VERIFICATION_CHANNELS.email) {
      where = {
        email: to,
        status: VERIFICATION_STATUS.VERIFIED,
        verifiedAt: MoreThanOrEqual(tenMinAgo),
      };
    }

    // 10분이내에 인증된 코드 검사
    const result = await this.verificationRepository.find({
      where,
      order: {
        verifiedAt: 'DESC',
      },
      take: 1,
    });

    return result.length === 1;
  }
}
