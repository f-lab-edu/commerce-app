import { TVerificationStatus, VERIFICATION_STATUS } from '../entity/types';

type TPending = (typeof VERIFICATION_STATUS)['PENDING'];
type TVerified = (typeof VERIFICATION_STATUS)['VERIFIED'];
type TFailed = (typeof VERIFICATION_STATUS)['FAIL'];

type TSendPending = {
  status: Extract<TVerificationStatus, TPending>;
};

type TSendSuccess = {
  status: Extract<TVerificationStatus, TVerified>;
};

type TSendFail = {
  status: Extract<TVerificationStatus, TFailed>;
  errorMessage: string;
};

type TSendStatus = TSendFail | TSendSuccess | TSendPending;

interface IUpdateVeriCommand {
  id: number;
  verifiedAt?: Date;
  status?: TSendStatus;
}

export class UpdateVeriCommand {
  public id: number;
  public verifiedAt?: Date;
  public status?: TVerificationStatus;
  public errorMessage?: string;

  constructor(param: IUpdateVeriCommand) {
    this.id = param.id;
    this.verifiedAt = param.verifiedAt;
    this.status = param.status?.status;
    if (this.status === VERIFICATION_STATUS.FAIL) {
      this.errorMessage = (param.status as TSendFail).errorMessage;
    }
  }
}
