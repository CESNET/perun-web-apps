import { Pipe, PipeTransform } from '@angular/core';
import { EnrichedFormItemDataDTO } from '@perun-web-apps/perun/registrar-openapi';

@Pipe({
  standalone: true,
  name: 'getLabelNewReg',
})
export class GetLabelNewRegPipe implements PipeTransform {
  transform(formItem: EnrichedFormItemDataDTO): string {
    if (!formItem.itemDefinition) {
      return formItem.formItemData.snapshotDisplayName;
    }
    if (formItem.itemDefinition.texts['en'].label !== null) {
      if (formItem.itemDefinition.texts['en'].label.length !== 0) {
        return formItem.itemDefinition.texts['en'].label;
      }
    }
    return formItem.formItem.name;
  }
}
