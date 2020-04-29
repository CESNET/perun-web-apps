import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseLastAccess',
  pure: true
})
export class ParseLastAccessPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return value.split('.')[0];
  }

}
