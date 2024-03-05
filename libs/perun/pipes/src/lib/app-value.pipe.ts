import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationFormItemData } from '@perun-web-apps/perun/openapi';

@Pipe({
  name: 'parseAppValue',
})
export class AppValuePipe implements PipeTransform {
  transform(array: Array<ApplicationFormItemData>, colName: string): string {
    const filter = array.filter((value) => value.shortname === colName);
    if (filter.length === 0) {
      return '';
    }
    return filter[0].value ?? filter[0].prefilledValue;
  }
}
