import { Provider } from '@nestjs/common';
import { BasePolicy } from '../../../common/policy/policy';
import { SignUpDto } from '../../dto/signup.dto';
import { SignUpPolicyImpl } from './signUp.policyImpl';

export const SignUpPolicyToken = Symbol('SignUpPolicy');
export const SignUpPolicyProvider: Provider<BasePolicy<SignUpDto>> = {
  provide: SignUpPolicyToken,
  useClass: SignUpPolicyImpl,
};
