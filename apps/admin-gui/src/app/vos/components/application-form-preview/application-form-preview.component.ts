import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ApplicationFormItem } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-application-form-preview',
  templateUrl: './application-form-preview.component.html',
  styleUrls: ['./application-form-preview.component.scss']
})
export class ApplicationFormPreviewComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(protected route: ActivatedRoute) { }

  loading = true;
  applicationFormItems: ApplicationFormItem[] = [];
  language = 'en';
  initialPage = true;
  mapForCombobox: Map<number, string> = new Map();

  ngOnInit() {
    this.route.queryParamMap.subscribe( params => {
      this.applicationFormItems = JSON.parse(params.get('applicationFormItems'));
      this.loading = false;
    });
  }

  switchToInitial() {
    this.initialPage = true;
  }

  switchToExtension() {
    this.initialPage = false;
  }

  switchToEnglish() {
    this.language = 'en';
  }

  switchToCzech() {
    this.language = 'cs';
  }

  getLocalizedOptions(applicationFormItem: ApplicationFormItem): string[] {
    if (applicationFormItem.i18n[this.language]) {
      const options = applicationFormItem.i18n[this.language].options;
      if (options !== null && options !== '') {
        const labels: string[] = [];
        for (const item of options.split('|')) {
          labels.push(item.split('#')[1]);
        }
        return labels;
      }
    }
    return [];
  }

  isValid(applicationFormItem: ApplicationFormItem) {
    if (applicationFormItem.forDelete) {
      return false;
    }
    for (const type of applicationFormItem.applicationTypes) {
      if (type === 'INITIAL' && this.initialPage) {
        return true;
      }
      if (type === 'EXTENSION' && !this.initialPage) {
        return true;
      }
    }
    return false;
  }

  getLocalizedLabel(applicationFormItem: ApplicationFormItem): string {
    if (applicationFormItem.i18n[this.language]) {
      return applicationFormItem.i18n[this.language].label;
    }
    return applicationFormItem.shortname;
  }

  getLocalizedHint(applicationFormItem: ApplicationFormItem) {
    if (applicationFormItem.i18n[this.language]) {
      return applicationFormItem.i18n[this.language].help;
    }
    return '';
  }
}
