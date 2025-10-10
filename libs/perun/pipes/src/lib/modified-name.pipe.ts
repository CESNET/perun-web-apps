import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  standalone: true,
  name: 'modifiedName',
})
export class ModifiedNamePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(modifiedBy: string): string {
    // const index = modifiedBy.lastIndexOf('/CN=');
    // if (index !== -1) {
    //   const string = modifiedBy
    //     .slice(index + 4, modifiedBy.length)
    //     .replace('/unstructuredName=', ' ');
    //   if (string.lastIndexOf('\\') !== -1) {
    //     return modifiedBy.slice(modifiedBy.lastIndexOf('=') + 1, modifiedBy.length);
    //   }
    //   return string;
    // }
    // return modifiedBy;

    if (modifiedBy === null) {
      return String(
        this.translate.instant(
          'VO_DETAIL.APPLICATION.APPLICATION_DETAIL.MODIFIED_NAME_NOT_AVAILABLE',
        ),
      );
    }

    if (modifiedBy === 'perunRegistrar') {
      return String(
        this.translate.instant('VO_DETAIL.APPLICATION.APPLICATION_DETAIL.MODIFIED_NAME_REGISTRAR'),
      );
    }

    return modifiedBy;
  }
}
