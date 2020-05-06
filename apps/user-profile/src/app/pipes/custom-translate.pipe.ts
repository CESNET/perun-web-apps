import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from '@perun-web-apps/perun/services';

@Pipe({
  name: 'customTranslate'
})
export class CustomTranslatePipe implements PipeTransform {

  constructor(private translate: TranslateService,
              private storage: StoreService) {
  }

  transform(value: string, lang?: string): any {
    const customLabelElements = this.storage.get('custom_labels');
    const keys = Object.keys(customLabelElements);
    for (let key of keys) {
      const element = this.storage.get('custom_labels', key);
      if (element.label === value) {
        return this.translate.currentLang === 'en' ? element.en : element.cz;
      }
    }
    return value;
  }
}
