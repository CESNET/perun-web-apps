import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'parseAppFriendlyName',
})
export class AppFriendlyNamePipe implements PipeTransform {
  transform(name: string): string {
    const index = name.lastIndexOf('/CN=');
    if (index !== -1) {
      const string = name.slice(index + 4, name.length).replace('/unstructuredName=', ' ');
      if (string.lastIndexOf('\\') !== -1) {
        return name.slice(name.lastIndexOf('=') + 1, name.length);
      }
      return string;
    }
    return name;
  }
}
