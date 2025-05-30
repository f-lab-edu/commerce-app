import { CommonConstraints } from '../../common/entity/base.constraints';

export class UserConstraints extends CommonConstraints {
  static readonly PASSWORD = {
    MIN_LENGTH: 8,
    MAX_LENGTH: 20,
    HASHED_MAX_LENGTH: 255,
    get atLeastTwoTypesOfPatternRule() {
      const alphaNumericPattern = '(?=.*[A-Za-z])(?=.*\\d)';
      const alphaSpecialCharPattern = '(?=.*[A-Za-z])(?=.*[!@#$%^&*?_])';
      const numberSpecialCharPattern = '(?=.*\\d)(?=.*[!@#$%^&*?_])';
      const allCharsInPassword = '[A-Za-z\\d!@#$%^&*?_]';
      const OR = '|';
      const BETWEEN = (min: number, max: number) => `{${min},${max}}$`;

      return (
        '^(?:' +
        alphaNumericPattern +
        OR +
        alphaSpecialCharPattern +
        OR +
        numberSpecialCharPattern +
        ')' +
        allCharsInPassword +
        BETWEEN(this.MIN_LENGTH, this.MAX_LENGTH)
      );
    },
  };
}
