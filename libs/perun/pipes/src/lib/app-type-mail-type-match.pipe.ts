import { Pipe, PipeTransform } from '@angular/core';
import { Application, ApplicationMail, AppType, MailType } from '@perun-web-apps/perun/openapi';

@Pipe({
  name: 'appMatchMailType',
})
export class AppTypeMailTypeMatchPipe implements PipeTransform {
  transform(apps: Application[], appMails: ApplicationMail[], selectedMail: MailType): boolean {
    const appTypes = new Set(apps.map((app) => app.type));
    const mailTypes = new Set(
      appMails.filter((mail) => mail.mailType === selectedMail).map((mail) => mail.appType),
    );

    if (appTypes.has(AppType.EXTENSION)) {
      return mailTypes.has(AppType.EXTENSION);
    }
    // Embedded gets send as initial so this is fine
    return mailTypes.has(AppType.INITIAL);
  }
}
