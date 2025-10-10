import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationMail } from '@perun-web-apps/perun/openapi';

@Pipe({
  standalone: true,
  name: 'appMailSendingDisabled',
})
export class AppMailSendingDisabledPipe implements PipeTransform {
  transform(mail: ApplicationMail): boolean {
    for (const key in mail.message) {
      if (
        (mail.message[key].text?.length > 0 && mail.message[key].subject?.length > 0) ||
        (mail.htmlMessage[key].text?.length > 0 && mail.htmlMessage[key].subject?.length > 0)
      ) {
        return false;
      }
    }
    return true;
  }
}
