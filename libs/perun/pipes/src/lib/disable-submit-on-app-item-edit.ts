import { Pipe, PipeTransform } from '@angular/core';
import { Type } from '@perun-web-apps/perun/openapi';

@Pipe({
  name: 'disableSubmitOnAppItemEdit',
})
export class DisableSubmitOnAppItemEditPipe implements PipeTransform {
  transform(
    inputFormGroupInvalid: boolean,
    inputFormGroupPending: boolean,
    optionsFormArrayInvalid: boolean,
    optionsFormArrayPending: boolean,
    loading: boolean,
    itemRequired: boolean,
    itemPerunSourceAttribute: string,
    itemFederationAttribute: string,
    itemDisabled: string,
    itemHidden: string,
    itemType: Type,
    itemPerunDestinationAttribute: string,
    typesRequiringDestinationAttribute: Type[],
  ): boolean {
    const disabledItemWOPrefilledValue =
      itemRequired &&
      itemPerunSourceAttribute === '' &&
      itemFederationAttribute === '' &&
      (itemDisabled === 'ALWAYS' || itemHidden === 'ALWAYS');
    const itemWORequiredDestinationAttribute =
      typesRequiringDestinationAttribute.includes(itemType) &&
      (itemPerunDestinationAttribute === '' || itemPerunDestinationAttribute === null);
    return (
      inputFormGroupInvalid ||
      inputFormGroupPending ||
      loading ||
      optionsFormArrayInvalid ||
      optionsFormArrayPending ||
      disabledItemWOPrefilledValue ||
      itemWORequiredDestinationAttribute
    );
  }
}
