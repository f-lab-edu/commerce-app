import { UserEmailVO } from '../../user/vo/email.vo';
import { HTMLContentVO } from './html.vo';

export class EmailOptionVO {
  private _to: UserEmailVO;
  private _subject: string;
  private _content: HTMLContentVO;
  private _from?: string;

  constructor(
    to: UserEmailVO,
    subject: string,
    content: HTMLContentVO,
    from?: string,
  ) {
    this._to = to;
    this._subject = subject;
    this._content = content;
    this._from = from;
  }

  get to() {
    return this._to;
  }

  get subject() {
    return this._subject;
  }

  get content() {
    return this._content;
  }

  get from() {
    return this._from;
  }
}
