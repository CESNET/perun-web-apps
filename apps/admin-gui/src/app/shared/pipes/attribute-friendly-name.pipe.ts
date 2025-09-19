import { Pipe, PipeTransform } from '@angular/core';
import { parseAttributeFriendlyName } from '@perun-web-apps/perun/utils';

@Pipe({
  standalone: true,
  name: 'attributeFriendlyName',
})
export class AttributeFriendlyNamePipe implements PipeTransform {
  transform(value: string): string {
    return parseAttributeFriendlyName(value);
  }
}
