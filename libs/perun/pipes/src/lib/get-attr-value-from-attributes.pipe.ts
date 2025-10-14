import { Pipe, PipeTransform } from '@angular/core';
import { Attribute } from '@perun-web-apps/perun/openapi';

@Pipe({
  standalone: true,
  name: 'getAttrValueFromAttributes',
})
export class GetAttrValueFromAttributesPipe implements PipeTransform {
  transform(attributes: Attribute[], friendlyName: string): string {
    const attribute = attributes.find((att) => att.friendlyName === friendlyName);
    return (attribute?.value as string) ?? '';
  }
}
