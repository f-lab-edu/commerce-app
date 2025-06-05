export const USER_ROLE = {
  buyer: 'buyer',
  seller: 'seller',
} as const;

type UserRoleType = typeof USER_ROLE;

export type TRole = UserRoleType[keyof UserRoleType];
