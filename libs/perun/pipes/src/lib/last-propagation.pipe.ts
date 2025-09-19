import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { PerunTranslateService } from '@perun-web-apps/perun/services';

@Pipe({
  standalone: true,
  name: 'lastPropagation',
})
export class LastPropagationPipe implements PipeTransform {
  constructor(private translate: PerunTranslateService) {}

  transform(propagationAt: string): string {
    return propagationAt
      ? formatDate(propagationAt.toString(), 'yyyy-MM-dd HH:mm:ss', 'en-GB')
      : this.translate.instant('SHARED.COMPONENTS.DESTINATIONS_LIST.NO_TIMESTAMP');
  }
}
