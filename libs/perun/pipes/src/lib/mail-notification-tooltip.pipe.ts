import { Pipe, PipeTransform } from '@angular/core';
import { PerunTranslateService } from '@perun-web-apps/perun/services';

@Pipe({
  name: 'mailNotificationTooltip',
})
export class MailNotificationTooltipPipe implements PipeTransform {
  constructor(private translate: PerunTranslateService) {}

  transform(editAuth: boolean, invalid: boolean, notFilled: boolean, missingTags: boolean): string {
    if (!editAuth) {
      return this.translate.instant('DIALOGS.NOTIFICATIONS_ADD_EDIT_MAIL.EDIT_HINT');
    }
    if (missingTags) {
      return this.translate.instant('DIALOGS.NOTIFICATIONS_ADD_EDIT_MAIL.MISSING_TAGS_TOOLTIP');
    }
    if (invalid) {
      return this.translate.instant('DIALOGS.NOTIFICATIONS_ADD_EDIT_MAIL.INVALID_HTML_CONTENT');
    }
    if (notFilled) {
      return this.translate.instant('DIALOGS.NOTIFICATIONS_ADD_EDIT_MAIL.ALL_LOCALES_EMPTY');
    }
    return '';
  }
}
