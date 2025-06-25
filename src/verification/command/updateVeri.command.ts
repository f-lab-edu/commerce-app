import { TVerificationStatus, VERIFICATION_STATUS } from '../entity/types';

type TSendPending = {
  status: Extract<TVerificationStatus, 'pending'>;
};

type TSendSuccess = {
  status: Extract<TVerificationStatus, 'success'>;
};

type TSendFail = {
  status: Extract<TVerificationStatus, 'fail'>;
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
