import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'footerLogoPath',
})
export class FooterLogoPathPipe implements PipeTransform {
  transform(url: string): string {
    return url.includes('/') ? url : '/assets/config/' + url;
  }
}
