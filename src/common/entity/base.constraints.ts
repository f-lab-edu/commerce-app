export class DBConstraints {
  static readonly TYPE_VARCHAR = 'varchar';
}

export abstract class CommonConstraints {
  static readonly DB_CONSTRAINTS = DBConstraints;
}
