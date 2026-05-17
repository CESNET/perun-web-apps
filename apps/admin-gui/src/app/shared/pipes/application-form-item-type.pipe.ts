import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Type } from '@perun-web-apps/perun/openapi';

@Pipe({
  standalone: true,
  name: 'applicationFormItemType',
})
export class ApplicationFormItemTypePipe implements PipeTransform {
  private returnData = '';

  constructor(private translateService: TranslateService) {}

  transform(value: Type, newReg = false): string {
    if (newReg) {
      return this.translateService.instant(
        'VO_DETAIL.SETTINGS.APPLICATION_FORM.NEW_REG_TYPES.' + value,
      ) as string;
    }
    this.translateService
      .get('VO_DETAIL.SETTINGS.APPLICATION_FORM.TYPES.' + value)
      .subscribe((text: string) => {
        this.returnData = text;
      });
    return this.returnData;
  }
}
