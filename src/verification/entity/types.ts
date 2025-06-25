export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verfied',
  FAIL: 'fail',
} as const;

type VerificationStatus = typeof VERIFICATION_STATUS;
export type TVerificationStatus = VerificationStatus[keyof VerificationStatus];
