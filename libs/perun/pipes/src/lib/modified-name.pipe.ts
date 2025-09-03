import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'modifiedName',
})
export class ModifiedNamePipe implements PipeTransform {
  transform(modifiedBy: string): string {
    const index = modifiedBy.lastIndexOf('/CN=');
    if (index !== -1) {
      const string = modifiedBy
        .slice(index + 4, modifiedBy.length)
        .replace('/unstructuredName=', ' ');
      if (string.lastIndexOf('\\') !== -1) {
        return modifiedBy.slice(modifiedBy.lastIndexOf('=') + 1, modifiedBy.length);
      }
      return string;
    }
    return modifiedBy;
  }
}
