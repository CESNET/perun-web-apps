import { Pipe, PipeTransform } from '@angular/core';
import { Attribute } from '@perun-web-apps/perun/openapi';

@Pipe({
  name: 'getMailFromAttributes'
})
export class GetMailFromAttributesPipe implements PipeTransform {

  transform(attributes: Attribute[], ...args: unknown[]): string {
    const attribute = attributes.find(att => att.friendlyName === 'mail');
    return attribute ? attribute.value.toString() : 'N/A';
  }

}
