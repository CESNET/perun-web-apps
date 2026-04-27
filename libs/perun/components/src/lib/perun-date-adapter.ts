import { EnvironmentProviders, Injectable, makeEnvironmentProviders } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
  NativeDateAdapter,
} from '@angular/material/core';

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: string): string {
    if (displayFormat === 'input') {
      const day: string = date.getDate().toString();
      // day = +day < 10 ? '0' + day : day;
      const month: string = (date.getMonth() + 1).toString();
      // month = +month < 10 ? '0' + month : month;
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    return date.toDateString();
  }
}

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

export function providePerunDateAdapter(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ]);
}
