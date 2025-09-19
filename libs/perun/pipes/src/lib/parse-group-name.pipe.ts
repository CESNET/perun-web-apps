import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'parseGroupName',
})
export class ParseGroupNamePipe implements PipeTransform {
  transform(groupName: string): string {
    const name = groupName.split(':');
    return name[name.length - 1];
  }
}
