import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationFormItem } from '@perun-web-apps/perun/openapi';

@Pipe({
  standalone: true,
  name: 'getLabel',
})
export class GetLabelPipe implements PipeTransform {
  transform(formItem: ApplicationFormItem): string {
    if (formItem.i18n['en'].label !== null) {
      if (formItem.i18n['en'].label.length !== 0) {
        return formItem.i18n['en'].label; // prerobit na ne en
      }
    }
    return formItem.shortname;
  }
}
