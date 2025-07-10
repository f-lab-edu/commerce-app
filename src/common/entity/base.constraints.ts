export class DBConstraints {
  static readonly BASIC_STRING = 'varchar';
  static readonly BASIC_TEXT = 'text';
  static readonly BASIC_NUMBER = 'int';
}

export class CommonConstraints {
  static readonly DB_CONSTRAINTS = DBConstraints;
}
