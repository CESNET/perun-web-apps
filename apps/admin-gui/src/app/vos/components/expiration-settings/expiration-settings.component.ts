import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { openClose } from '@perun-web-apps/perun/animations';
import { Attribute } from '@perun-web-apps/perun/openapi';
import { SettingsToggleItemComponent } from '../../../shared/components/settings-toggle-item/settings-toggle-item.component';

export class ExpirationAttrValue {
  lifecycleEnabled?: 'true' | 'false';
  period?: string;
  doNotExtendLoa?: string;
  doNotAllowLoa?: string;
  gracePeriod?: string;
  removeAfter?: string;
  archiveAfter?: string;
  periodLoa?: string;
}

export interface ExpirationConfiguration {
  enabled: boolean;
  periodEnabled: boolean;
  periodType: 'static' | 'dynamic';
  periodStatic: string;
  periodDynamic: string;
  periodDynamicUnit: 'y' | 'd' | 'm';
  doNotAllowLoasEnabled: boolean;
  doNotAllowLoas: number[];
  doNotExtendLoasEnabled: boolean;
  doNotExtendLoas: number[];
  gracePeriodEnabled: boolean;
  gracePeriod: string;
  gracePeriodUnit: 'y' | 'd' | 'm';
  removeAfterEnabled: boolean;
  removeAfter: string;
  removeAfterUnit: 'y' | 'd' | 'm';
  archiveAfterEnabled?: boolean;
  archiveAfter?: string;
  archiveAfterUnit?: 'y' | 'd' | 'm';
  specialLoaPeriodEnabled: boolean;
  specialLoa: number;
  specialLoaPeriod: string;
  specialLoaPeriodType: 'static' | 'dynamic';
  specialLoaPeriodStatic: string;
  specialLoaPeriodDynamic: string;
  specialLoaPeriodDynamicUnit: 'y' | 'd' | 'm';
  specialLoaPeriodExtendExpiredMembers: boolean;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltip,
    SettingsToggleItemComponent,
  ],
  standalone: true,
  selector: 'app-expiration-settings',
  templateUrl: './expiration-settings.component.html',
  styleUrls: ['./expiration-settings.component.scss'],
  animations: [openClose],
})
export class ExpirationSettingsComponent implements OnInit, OnChanges {
  @Input()
  expirationAttribute: Attribute;
  @Output()
  saveAttribute = new EventEmitter<Attribute>();
  initialConfiguration: ExpirationConfiguration;
  currentConfiguration: ExpirationConfiguration;
  loas = [0, 1, 2];
  datePattern = '^(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.$';
  dynamicAmountPattern = '^[1-9]+$';
  // TODO translation
  amountOptions = [
    {
      value: 'd',
      text: 'Days',
    },
    {
      value: 'm',
      text: 'Months',
    },
    {
      value: 'y',
      text: 'Years',
    },
  ];
  voId: number;

  ngOnInit(): void {
    const loaPeriods = new Map();
    this.loas.forEach((loa) => loaPeriods.set(loa, ''));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.expirationAttribute && this.expirationAttribute) {
      this.initialConfiguration = this.unParseAttrValue(
        this.expirationAttribute.value as ExpirationAttrValue,
      );
      this.currentConfiguration = this.unParseAttrValue(
        this.expirationAttribute.value as ExpirationAttrValue,
      );
    }
  }

  saveChanges(): void {
    this.saveAttribute.emit(this.parseExpirationRulesAttribute());
  }

  areChangesMade(): boolean {
    const currentValue = this.parseAttributeValueFromConfig(this.currentConfiguration);
    const initValue = this.parseAttributeValueFromConfig(this.initialConfiguration);

    if (initValue === null) {
      return currentValue !== null;
    }

    if (currentValue === null) {
      return true;
    }

    return (
      currentValue.lifecycleEnabled !== initValue.lifecycleEnabled ||
      currentValue.period !== initValue.period ||
      currentValue.gracePeriod !== initValue.gracePeriod ||
      currentValue.removeAfter !== initValue.removeAfter ||
      currentValue.archiveAfter !== initValue.archiveAfter ||
      currentValue.doNotExtendLoa !== initValue.doNotExtendLoa ||
      currentValue.doNotAllowLoa !== initValue.doNotAllowLoa ||
      currentValue.periodLoa !== initValue.periodLoa
    );
  }

  parseExpirationRulesAttribute(): Attribute {
    this.expirationAttribute.value = this.parseAttributeValueFromConfig(this.currentConfiguration);

    return this.expirationAttribute;
  }

  parsePeriod(config: ExpirationConfiguration): string {
    if (!config.periodEnabled) {
      return null;
    }
    switch (config.periodType) {
      case 'dynamic':
        return this.parseDynamicPeriod(config);
      case 'static':
        return this.parseStaticPeriod(config);
      default:
      // TODO show error
    }
  }

  createInitConfiguration(): ExpirationConfiguration {
    const loaPeriods = new Map();
    this.loas.forEach((loa) => loaPeriods.set(loa, ''));

    const form: ExpirationConfiguration = {
      enabled: false,
      periodEnabled: false,
      periodType: null,
      periodStatic: '',
      periodDynamic: '',
      periodDynamicUnit: 'm',
      doNotAllowLoas: [],
      doNotAllowLoasEnabled: false,
      doNotExtendLoas: [],
      doNotExtendLoasEnabled: false,
      gracePeriodEnabled: false,
      gracePeriod: null,
      gracePeriodUnit: null,
      removeAfterEnabled: false,
      removeAfter: null,
      removeAfterUnit: null,
      specialLoaPeriodEnabled: false,
      specialLoaPeriod: '',
      specialLoa: null,
      specialLoaPeriodType: null,
      specialLoaPeriodDynamic: '',
      specialLoaPeriodDynamicUnit: 'm',
      specialLoaPeriodStatic: '',
      specialLoaPeriodExtendExpiredMembers: false,
    };

    if (this.expirationAttribute.entity === 'vo') {
      form.archiveAfterEnabled = true;
      form.archiveAfter = null;
      form.archiveAfterUnit = null;
    }

    return form;
  }

  unParseAttrValue(value: ExpirationAttrValue): ExpirationConfiguration {
    let config = this.createInitConfiguration();

    if (value == null) {
      return config;
    }
    config.enabled =
      value.lifecycleEnabled !== undefined ? value.lifecycleEnabled === 'true' : false;

    if (value.period !== undefined && value.period.length > 0) {
      config = this.setPeriodValues(value, config);
    }

    if (value.doNotAllowLoa !== undefined && value.doNotAllowLoa.length > 0) {
      config = this.setDoNotAllowLoasValues(value, config);
    }

    if (value.doNotExtendLoa !== undefined && value.doNotExtendLoa.length > 0) {
      config = this.setDoNotExtendLoasValues(value, config);
    }

    if (value.gracePeriod !== undefined && value.gracePeriod.length > 0) {
      config = this.setDynamicPeriodValues(value, config, 'gracePeriod');
    }

    if (value.removeAfter !== undefined && value.removeAfter.length > 0) {
      config = this.setDynamicPeriodValues(value, config, 'removeAfter');
    }

    if (value.archiveAfter !== undefined && value.archiveAfter.length > 0) {
      config = this.setDynamicPeriodValues(value, config, 'archiveAfter');
    }

    if (value.periodLoa !== undefined && value.periodLoa.length > 0) {
      config = this.setSpecialLoaPeriodValues(value, config);
    }

    return config;
  }

  private setPeriodValues(
    value: ExpirationAttrValue,
    config: ExpirationConfiguration,
  ): ExpirationConfiguration {
    config.periodEnabled = true;
    if (value.period.startsWith('+')) {
      config.periodType = 'dynamic';

      const unit = value.period.charAt(value.period.length - 1);
      config.periodDynamic = value.period.substring(1, value.period.length - 1);
      config.periodDynamicUnit = unit as 'm' | 'd' | 'y';
    } else {
      config.periodType = 'static';

      config.periodStatic = value.period;
    }
    return config;
  }

  private setDoNotAllowLoasValues(
    value: ExpirationAttrValue,
    config: ExpirationConfiguration,
  ): ExpirationConfiguration {
    const loas: number[] = [];
    value.doNotAllowLoa.split(',').forEach((l) => loas.push(parseInt(l.trim(), 10)));
    config.doNotAllowLoas = loas;
    if (loas.length > 0) {
      config.doNotAllowLoasEnabled = true;
    }
    return config;
  }

  private setDoNotExtendLoasValues(
    value: ExpirationAttrValue,
    config: ExpirationConfiguration,
  ): ExpirationConfiguration {
    const loas: number[] = [];
    value.doNotExtendLoa.split(',').forEach((l) => loas.push(parseInt(l.trim(), 10)));
    config.doNotExtendLoas = loas;
    if (loas.length > 0) {
      config.doNotExtendLoasEnabled = true;
    }
    return config;
  }

  private setDynamicPeriodValues(
    value: ExpirationAttrValue,
    config: ExpirationConfiguration,
    property: string,
  ): ExpirationConfiguration {
    config[property + 'Enabled'] = true;
    const valueProperty = value[property] as string;
    const unit = valueProperty.charAt(valueProperty.length - 1);
    config[property] = valueProperty.substring(0, valueProperty.length - 1);
    config[property + 'Unit'] = unit as 'm' | 'd' | 'y';
    return config;
  }

  private setSpecialLoaPeriodValues(
    value: ExpirationAttrValue,
    config: ExpirationConfiguration,
  ): ExpirationConfiguration {
    config.specialLoa = parseInt(value.periodLoa.substring(0, value.periodLoa.indexOf('|')), 10);
    config.specialLoaPeriodEnabled = true;

    let specialPeriodValue = value.periodLoa.substring(
      value.periodLoa.indexOf('|') + 1,
      value.periodLoa.length,
    );

    if (specialPeriodValue.startsWith('+')) {
      if (specialPeriodValue.endsWith('.')) {
        config.specialLoaPeriodExtendExpiredMembers = true;
        specialPeriodValue = specialPeriodValue.substring(0, specialPeriodValue.length - 1);
      }

      config.specialLoaPeriodType = 'dynamic';

      const unit = specialPeriodValue.charAt(specialPeriodValue.length - 1);
      config.specialLoaPeriodDynamic = specialPeriodValue.substring(
        1,
        specialPeriodValue.length - 1,
      );
      config.specialLoaPeriodDynamicUnit = unit as 'm' | 'd' | 'y';
    } else {
      if (specialPeriodValue.endsWith('..')) {
        config.specialLoaPeriodExtendExpiredMembers = true;
        specialPeriodValue = specialPeriodValue.substring(0, specialPeriodValue.length - 1);
      }

      config.specialLoaPeriodType = 'static';

      config.specialLoaPeriodStatic = specialPeriodValue;
    }

    return config;
  }

  private parseDynamicPeriod(config: ExpirationConfiguration): string {
    return '+' + config.periodDynamic + config.periodDynamicUnit;
  }

  private parseStaticPeriod(config: ExpirationConfiguration): string {
    return config.periodStatic;
  }

  private parseDontAllowLoas(config: ExpirationConfiguration): string {
    if (!config.doNotAllowLoasEnabled) {
      return null;
    }

    let dontAllowLoas = '';
    config.doNotAllowLoas.forEach((loa) => (dontAllowLoas += loa.toString() + ','));

    if (dontAllowLoas.length > 0) {
      dontAllowLoas = dontAllowLoas.substring(0, dontAllowLoas.length - 1);
    }

    return dontAllowLoas.length > 0 ? dontAllowLoas : null;
  }

  private parseDontExtendLoas(config: ExpirationConfiguration): string {
    if (!config.doNotExtendLoasEnabled) {
      return null;
    }

    let dontExtendLoas = '';
    config.doNotExtendLoas.forEach((loa) => (dontExtendLoas += loa.toString() + ','));

    if (dontExtendLoas.length > 0) {
      dontExtendLoas = dontExtendLoas.substring(0, dontExtendLoas.length - 1);
    }

    return dontExtendLoas.length > 0 ? dontExtendLoas : null;
  }

  private parseDynamicCustomPeriod(config: ExpirationConfiguration, property: string): string {
    const value = config[property] as string;
    if (
      !config[property + 'Enabled'] ||
      value === null ||
      value.length === 0 ||
      config[property + 'Unit'] === null
    ) {
      return null;
    }

    return value + config[property + 'Unit'];
  }

  private parseSpecialLoaPeriod(config: ExpirationConfiguration): string {
    if (!config.specialLoaPeriodEnabled || !config.specialLoa) {
      return null;
    }

    let period = config.specialLoa.toString() + '|';

    switch (config.specialLoaPeriodType) {
      case 'static':
        period += this.parseSpecialLoaPeriodStatic(config);
        break;
      case 'dynamic':
        period += this.parseSpecialLoaPeriodDynamic(config);
        break;
      default:
      // TODO show error
    }

    if (period != null && config.specialLoaPeriodExtendExpiredMembers) {
      period += '.';
    }

    return period;
  }

  private parseSpecialLoaPeriodStatic(config: ExpirationConfiguration): string {
    return config.specialLoaPeriodStatic;
  }

  private parseSpecialLoaPeriodDynamic(config: ExpirationConfiguration): string {
    return '+' + config.specialLoaPeriodDynamic + config.specialLoaPeriodDynamicUnit;
  }

  private parseAttributeValueFromConfig(config: ExpirationConfiguration): ExpirationAttrValue {
    const value: ExpirationAttrValue = {};

    value.lifecycleEnabled = config.enabled ? 'true' : 'false';

    const period = this.parsePeriod(config);
    const dontAllowLoas = this.parseDontAllowLoas(config);
    const dontExtendLoad = this.parseDontExtendLoas(config);
    const gracePeriod = this.parseDynamicCustomPeriod(config, 'gracePeriod');
    const removeAfter = this.parseDynamicCustomPeriod(config, 'removeAfter');
    const archiveAfter = this.parseDynamicCustomPeriod(config, 'archiveAfter');

    const specialLoaPeriod = this.parseSpecialLoaPeriod(config);

    if (period !== null) {
      value.period = period;
    }

    if (dontExtendLoad !== null) {
      value.doNotExtendLoa = dontExtendLoad;
    }
    if (dontAllowLoas !== null) {
      value.doNotAllowLoa = dontAllowLoas;
    }
    if (gracePeriod !== null) {
      value.gracePeriod = gracePeriod;
    }
    if (removeAfter !== null) {
      value.removeAfter = removeAfter;
    }
    if (archiveAfter !== null) {
      value.archiveAfter = archiveAfter;
    }
    if (specialLoaPeriod !== null) {
      value.periodLoa = specialLoaPeriod;
    }

    return value;
  }
}
