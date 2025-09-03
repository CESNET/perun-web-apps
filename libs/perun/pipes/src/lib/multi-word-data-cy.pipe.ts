import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'multiWordDataCy',
})
export class MultiWordDataCyPipe implements PipeTransform {
  transform(value: string): unknown {
    return value.replace(/\s/g, '-').replace(/\./g, '-').toLowerCase();
  }
}
