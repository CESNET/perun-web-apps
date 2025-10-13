import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  standalone: true,
  name: 'modifiedName',
})
export class ModifiedNamePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(modifiedBy: string, fallback: string): string {
    if (!modifiedBy) {
      const index = fallback.lastIndexOf('/CN=');
      if (index !== -1) {
        const string = fallback
          .slice(index + 4, fallback.length)
          .replace('/unstructuredName=', ' ');
        if (string.lastIndexOf('\\') !== -1) {
          return fallback.slice(fallback.lastIndexOf('=') + 1, fallback.length);
        }
        return string;
      }
      return fallback;
    }

    if (modifiedBy === 'perunRegistrar') {
      return String(
        this.translate.instant('VO_DETAIL.APPLICATION.APPLICATION_DETAIL.MODIFIED_NAME_REGISTRAR'),
      );
    }

    return modifiedBy;
  }
}
