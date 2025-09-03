import { Pipe, PipeTransform } from '@angular/core';
import { getFedValue } from '@perun-web-apps/perun/utils';

@Pipe({
  standalone: true,
  name: 'parseFedInfo',
})
export class AppFedInfoParsePipe implements PipeTransform {
  transform(fedInfo: string, colName: string): string {
    return getFedValue(fedInfo, colName);
  }
}
