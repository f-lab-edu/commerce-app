export const VERIFICATION_METHODS = {
  email: 'email',
  mobile: 'mobile',
} as const;

type _VerificationMethods = typeof VERIFICATION_METHODS;
export type TVerificationMethod =
  _VerificationMethods[keyof _VerificationMethods];

export const availableMethods = Object.keys(VERIFICATION_METHODS);

export class SendCodeCommand {
  constructor(
    private readonly _target: string,
    private readonly _method: TVerificationMethod = VERIFICATION_METHODS.email,
  ) {}

  get target() {
    return this._target;
  }

  get method() {
    return this._method;
  }
}
