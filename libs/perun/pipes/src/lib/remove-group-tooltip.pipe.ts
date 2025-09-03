import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Group } from '@perun-web-apps/perun/openapi';

@Pipe({
  standalone: true,
  name: 'removeGroupTooltip',
})
export class RemoveGroupTooltipPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: Group, lastGroupsVo: number[], lastGroupsFac: number[]): string {
    let result = '';
    if (lastGroupsVo.includes(value.id)) {
      result = result + this.translate.instant('DIALOGS.DELETE_ENTITY.WARN_LAST_VO_TOOLTIP');
    }
    if (lastGroupsFac.includes(value.id)) {
      result = result.length > 0 ? result + '\n\n' : '';
      result = result + this.translate.instant('DIALOGS.DELETE_ENTITY.WARN_LAST_FAC_TOOLTIP');
    }
    return result;
  }
}
