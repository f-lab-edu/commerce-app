import { EmailOptionVO } from '../vo/emailOption.vo';

export interface EmailSender {
  sendEmail(emailOption: EmailOptionVO): Promise<void>;
}
