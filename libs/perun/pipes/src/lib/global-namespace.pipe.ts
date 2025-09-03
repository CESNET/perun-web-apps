import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'globalNamespace',
})
export class GlobalNamespacePipe implements PipeTransform {
  transform(namespace: string): string {
    return namespace || 'GLOBALLY BLOCKED';
  }
}
