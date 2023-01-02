import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomMatPaginator extends MatPaginatorIntl {
  getRangeLabel = function (page: number, pageSize: number, length: number): string {
    let estimatedLength: string;
    const start = page * pageSize + 1;
    const range = (page + 1) * pageSize;
    const end = range > length ? length : range;

    if (length < 1000) {
      return `${start} – ${end} of ${String(length)}`;
    } else if (length < 10000) {
      estimatedLength = '1 000';
    } else if (length < 100000) {
      estimatedLength = '10 000';
    } else {
      estimatedLength = '100 000';
    }

    return `${start} – ${end} of ${estimatedLength} +`;
  };
}
