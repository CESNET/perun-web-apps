export class Language {
  errorMessage: string;
  help: string;
  label: string;
  locale: string;
  options: string;

  constructor(locale: string) {
    this.locale = locale;
    this.errorMessage = '';
    this.help = '';
    this.label = '';
  }
}

export class ApplicationFormItem {
  applicationTypes: string[];
  beanName: string;
  federationAttribute: string;
  forDelete: boolean;
  i18n: { [s: string]: Language; };
  id: number;
  ordnum: number;
  perunDestinationAttribute: string;
  perunSourceAttribute: string;
  regex: string;
  required: boolean;
  shortname: string;
  type: string;

  constructor() {
    this.applicationTypes = ['INITIAL', 'EXTENSION'];
    this.federationAttribute = '';
    this.i18n = {};
    this.i18n['cs'] = new Language('cs');
    this.i18n['en'] = new Language('en');
    this.id = 0;
    this.ordnum = 0;
    this.perunDestinationAttribute = null;
    this.perunSourceAttribute = null;
    this.regex = '';
    this.required = false;
    this.shortname = '';
    this.type = '';
  }
}
