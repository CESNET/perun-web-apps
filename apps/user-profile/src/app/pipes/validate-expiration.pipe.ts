import { Pipe, PipeTransform } from '@angular/core';
import { Attribute } from '@perun-web-apps/perun/openapi';

@Pipe({
  standalone: true,
  name: 'validateExpiration',
  pure: true,
})
export class ValidateExpirationPipe implements PipeTransform {
  transform(expirationAttribute: Attribute): string {
    return (expirationAttribute?.value as string) ?? 'MEMBERSHIP_LIST.NEVER';
  }
}
