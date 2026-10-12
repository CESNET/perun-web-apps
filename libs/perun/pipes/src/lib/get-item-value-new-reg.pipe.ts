import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnrichedFormItemDataDTO } from '@perun-web-apps/perun/registrar-openapi';

@Pipe({
  standalone: true,
  name: 'getItemValueNewReg',
})
export class GetItemValueNewRegPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(
    formItem: EnrichedFormItemDataDTO,
    embeddedTargets?: Record<string, { name?: string; objectId: string }>,
  ): string {
    const raw = formItem?.formItemData?.value;
    if (!raw) {
      return raw ?? '';
    }
    const definition = formItem.itemDefinition;
    if (!definition) {
      // outdated application whose item/definition no longer exists: nothing to
      // resolve the value against, show the stored value as-is
      return raw;
    }
    // option values and labels live in the item definition's configuration
    const configuration = (
      definition as unknown as {
        configuration?: {
          options?: { value?: string; labels?: Record<string, string> }[];
          targets?: { value?: string; labels?: Record<string, string> }[];
        };
      }
    ).configuration;
    if (definition.type === 'EMBEDDED_GROUPS') {
      return this.mapEmbeddedValue(raw, configuration?.targets ?? [], embeddedTargets);
    }
    const options = configuration?.options ?? [];
    if (options.length === 0) {
      return raw;
    }
    const labelOf = (optionValue: string): string | undefined => {
      const option = options.find((entry) => entry.value === optionValue);
      if (!option) {
        return undefined;
      }
      return (
        option.labels?.[this.translate.currentLang] ??
        option.labels?.['en'] ??
        Object.values(option.labels ?? {})[0]
      );
    };
    // known options render as label(value) so the stored value stays visible;
    // unknown/custom values are shown as-is
    const mapValue = (optionValue: string): string => {
      const label = labelOf(optionValue);
      return label !== undefined ? `${label}(${optionValue})` : optionValue;
    };
    if (definition.type === 'CHECKBOX') {
      // checkbox values are comma-separated option values
      return raw.split(',').map(mapValue).join(', ');
    }
    return mapValue(raw);
  }

  /**
   * The embedded value is a JSON array of embedded form UUIDs. Each entry renders as
   * `group name#group id` (the legacy embedded value format, e.g. `second#27067|tesg#27066`):
   * the name is the configured target label, falling back to the live name of the target
   * form's IdM object, and the id comes from the target form (unlabeled targets have no
   * name in the configuration). Without any name the raw form id is shown.
   */
  private mapEmbeddedValue(
    raw: string,
    targets: { value?: string; labels?: Record<string, string> }[],
    embeddedTargets?: Record<string, { name?: string; objectId: string }>,
  ): string {
    let values: unknown;
    try {
      values = JSON.parse(raw);
    } catch {
      return raw;
    }
    if (!Array.isArray(values)) {
      return raw;
    }
    const displayOf = (formId: string): string => {
      const target = targets.find((entry) => entry.value === formId);
      const label = target
        ? target.labels?.[this.translate.currentLang] ??
          target.labels?.['en'] ??
          Object.values(target.labels ?? {})[0]
        : undefined;
      const targetObject = embeddedTargets?.[formId];
      const name = label ?? targetObject?.name;
      if (name === undefined) {
        return formId;
      }
      return targetObject?.objectId ? `${name}#${targetObject.objectId}` : name;
    };
    return values
      .filter((value): value is string => typeof value === 'string')
      .map(displayOf)
      .join('|');
  }
}
