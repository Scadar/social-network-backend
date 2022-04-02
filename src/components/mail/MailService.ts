import {Singleton} from '../../utils/Singleton';
import nodeMailer, {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USERNAME} from '../../config';

@Singleton
class MailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodeMailer.createTransport({
      host: MAIL_HOST,
      port: Number(MAIL_PORT),
      secure: true,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });
  }

  public async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: MAIL_USERNAME,
      to,
      subject: 'Активация аккаунта',
      text: '',
      html:
          `
          <div>
            <h1>Для активации перейдите по ссылке</h1>
            <a href="${link}">Ссылка</a>
          </div>
        `,
    });
  }
}

export default MailService;
