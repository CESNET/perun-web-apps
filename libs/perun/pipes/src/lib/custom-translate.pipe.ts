import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from '@perun-web-apps/perun/services';

interface CustomLabel {
  label: string;
  en: string;
  cs: string;
}

@Pipe({
  standalone: true,
  name: 'customTranslate',
})
export class CustomTranslatePipe implements PipeTransform {
  constructor(
    private translate: TranslateService,
    private storage: StoreService,
  ) {}

  transform(value: string, lang = 'en'): string {
    const customLabelElements: CustomLabel[] = this.storage.getProperty('custom_labels');
    if (customLabelElements) {
      for (const element of customLabelElements) {
        if (element.label === value) {
          return element[lang] as string;
        }
      }
    }
    return value;
  }
}
