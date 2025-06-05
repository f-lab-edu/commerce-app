import { Provider } from '@nestjs/common';
import { SignUpDto } from '../../dto/signup.dto';
import { BasePolicyService } from '../../../common/policy/policy';
import { SignUpPolicyServiceImpl } from './signUp.policyImpl';

export const SignUpPolicyToken = Symbol('SignUpPolicy');
export const SignUpPolicyProvider: Provider<BasePolicyService<SignUpDto>> = {
  provide: SignUpPolicyToken,
  useClass: SignUpPolicyServiceImpl,
};
