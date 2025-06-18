export const VERIFICATION_CHANNELS = {
  email: 'email',
  sms: 'sms',
} as const;

type _VerificationMethods = typeof VERIFICATION_CHANNELS;
export type TVerificationMethod =
  _VerificationMethods[keyof _VerificationMethods];

export const availableMethods = Object.keys(VERIFICATION_CHANNELS);

export class SendCodeCommand {
  constructor(
    private readonly _to: string,
    private readonly _channel: TVerificationMethod = VERIFICATION_CHANNELS.email,
  ) {}

  get to() {
    return this._to;
  }

  get channel() {
    return this._channel;
  }
}
