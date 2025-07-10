export const VERIFICATION_CHANNELS = {
  email: 'email',
  sms: 'sms',
} as const;

type _VerificationChannel = typeof VERIFICATION_CHANNELS;
export type VerificationChannel =
  _VerificationChannel[keyof _VerificationChannel];

export const availableMethods = Object.keys(VERIFICATION_CHANNELS);

export class SendCodeCommand {
  constructor(
    private readonly _to: string,
    private readonly _channel: VerificationChannel = VERIFICATION_CHANNELS.email,
  ) {}

  get to() {
    return this._to;
  }

  get channel() {
    return this._channel;
  }
}
