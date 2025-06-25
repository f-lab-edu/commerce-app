import { JSDOM } from 'jsdom';

export class HTMLContentVO {
  private _html: string;

  constructor(html: string) {
    this.validateHTML(html);
    this._html = html;
  }

  private validateHTML(html: string) {
    try {
      const dom = new JSDOM(html);
    } catch (error) {
      throw new Error(`올바른 HTML 형식을 입력해 주세요. 입력: ${html}`);
    }
  }

  get html() {
    return this._html;
  }
}
