import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(mail: any) {
    // const url = `example.com/auth/confirm?token=${token}`;

    return await this.mailerService.sendMail({
      to: mail.email,
      subject: mail.subject,
      template: mail.template, // `.hbs` extension is appended automatically
      context: mail.context,
    });
  }
}
