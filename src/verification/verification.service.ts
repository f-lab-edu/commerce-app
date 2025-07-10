import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EmailVerificationEntity,
  PersistedEmailVerificationEntity,
} from './entity/emailVerification.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { VerificationHistoryCreateCommand } from './vo/saveCode.command';
import { UpdateVeriCommand } from './command/updateVeri.command';
import { UserEmailVO } from '../user/vo/email.vo';
import { VERIFICATION_STATUS } from './entity/types';
import { VERIFICATION_CHANNELS } from './command/sendCode.command';
import { VeriCodeVO } from './vo/code.vo';
import { VeriStrategyFactory } from './strategy/strategy.factory';
import { UserPhoneVO } from '../user/vo/phone.vo';
import { VerificationVO } from './vo/verification.vo';
import {
  EmailSendException,
  VerificationCodeSendException,
} from '../common/exception/service.exception';

// 인증정보는 SMS와 UserEmailVo롤 가질 수 있음
// 추후 type To = UserEmailVO | UserPhoneNumberVO 가능

export type EmailContact = {
  to: UserEmailVO;
  channel?: (typeof VERIFICATION_CHANNELS)['email'];
};

type PhoneContact = {
  to: UserPhoneVO;
  channel: (typeof VERIFICATION_CHANNELS)['sms'];
};

type VerificationContact = EmailContact | PhoneContact;

type VerificationSendAndSaveCommandType = {
  verificationCodeVO: VeriCodeVO;
  verificationVO: VerificationVO;
};

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private verificationRepository: Repository<PersistedEmailVerificationEntity>,
    private readonly veriStrategyFactory: VeriStrategyFactory,
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

  async saveVeriSendInfo(createVeriCommand: VerificationHistoryCreateCommand) {
    return await this.verificationRepository.save(createVeriCommand);
  }

  async updateVeriInfo(updateVeriCommand: UpdateVeriCommand) {
    const { id, ...newData } = updateVeriCommand;

    return await this.verificationRepository.update(id, { ...newData });
  }

  async isSendBlocked(verificationVO: VerificationVO) {
    let where: any = {
      status: VERIFICATION_STATUS.PENDING,
    };

    where[verificationVO.getChannel()] = verificationVO.getContact();

    const results = await this.verificationRepository.find({
      where,
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

  async sendAndSave({
    verificationCodeVO,
    verificationVO,
  }: VerificationSendAndSaveCommandType) {
    const verificationStrategy = this.veriStrategyFactory.getStrategy(
      verificationVO.getChannel() ?? VERIFICATION_CHANNELS.email,
    );

    await verificationStrategy.send(verificationVO, verificationCodeVO);

    return await this.saveVerificationHistory({
      verificationCodeVO,
      verificationVO,
    });
  }

  async saveVerificationHistory({
    verificationCodeVO,
    verificationVO,
  }: VerificationSendAndSaveCommandType) {
    let verificationEntity: PersistedEmailVerificationEntity | null = null;
    try {
      verificationEntity = await this.saveVeriSendInfo(
        new VerificationHistoryCreateCommand(
          verificationCodeVO,
          verificationVO.getContact(),
        ),
      );

      return verificationEntity;
    } catch (error) {
      if (error instanceof EmailSendException && verificationEntity !== null) {
        await this.updateVeriInfo(
          new UpdateVeriCommand({
            id: verificationEntity.id!,
            status: {
              status: VERIFICATION_STATUS.FAIL,
              errorMessage: error.message,
            },
          }),
        );
        throw new VerificationCodeSendException(error.message);
      }

      throw new VerificationCodeSendException(
        '인증코드 저장에 실패했습니다. DB상태를 확인해주세요.',
      );
    }
  }
}
