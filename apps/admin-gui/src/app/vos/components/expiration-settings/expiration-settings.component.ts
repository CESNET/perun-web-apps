import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
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
  activityCap?: string;
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
  periodType: 'static' | 'dynamic' | 'inactivity';
  periodStatic: string;
  periodDynamic: string;
  periodDynamicUnit: 'y' | 'd' | 'm';
  periodInactivity: string;
  periodInactivityUnit: 'y' | 'm';
  activityCap: string;
  activityCapUnit: 'y' | 'm';
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
    MatIcon,
    MatIconButton,
    SettingsToggleItemComponent,
  ],
  standalone: true,
  selector: 'app-expiration-settings',
  templateUrl: './expiration-settings.component.html',
  styleUrls: ['./expiration-settings.component.scss'],
  animations: [openClose],
})
export class ExpirationSettingsComponent implements OnInit, OnChanges {
  // 5 years in months - maximum allowed value of the inactivity period and the mandatory review period
  static readonly MAX_PERIOD_MONTHS = 60;

  @Input()
  expirationAttribute: Attribute;
  @Output()
  saveAttribute = new EventEmitter<Attribute>();
  initialConfiguration: ExpirationConfiguration;
  currentConfiguration: ExpirationConfiguration;
  loas = [0, 1, 2];
  datePattern = '^(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.$';
  dynamicAmountPattern = '^[1-9][0-9]*$';
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
  // months and years only - used for the expiration period and the activity-based settings
  amountOptionsWithoutDays = [
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

    if (!this.validateExpirationRules()) {
      return false;
    }

    if (initValue === null) {
      return currentValue !== null;
    }

    if (currentValue === null) {
      return true;
    }

    return (
      currentValue.lifecycleEnabled !== initValue.lifecycleEnabled ||
      currentValue.period !== initValue.period ||
      currentValue.activityCap !== initValue.activityCap ||
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
      case 'inactivity':
        return this.parseInactivityPeriod(config);
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
      periodInactivity: '',
      periodInactivityUnit: 'm',
      activityCap: '',
      activityCapUnit: 'm',
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
      form.archiveAfterEnabled = false;
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

    if (value.activityCap !== undefined && value.activityCap.length > 0) {
      config = this.setActivityCapValues(value, config);
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

  onPeriodEnabledChange(value: boolean): void {
    this.currentConfiguration.periodEnabled = value;
    this.currentConfiguration.gracePeriodEnabled = this.currentConfiguration.periodEnabled;
  }
  onPeriodTypeChange(event: MatRadioChange): void {
    // prefill the recommended default for the mandatory review period when the inactivity model is selected
    if (event.value === 'inactivity' && !this.currentConfiguration.activityCap) {
      this.currentConfiguration.activityCap = '5';
      this.currentConfiguration.activityCapUnit = 'y';
    }
  }
  getSaveTooltip(): string {
    if (!this.expirationAttribute.writable) {
      return 'VO_MANAGEMENT.SETTINGS.EXPIRATION.PERMISSION_DENIED_HINT';
    }

    if (!this.validateExpirationRules()) {
      return 'VO_MANAGEMENT.SETTINGS.EXPIRATION.REQUIRED_FIELD_HINT';
    }

    if (!this.areChangesMade()) {
      return 'VO_MANAGEMENT.SETTINGS.EXPIRATION.NO_CHANGES_HINT';
    }

    return '';
  }

  // converts the amount + unit pair to months, returns null when the value is not filled in
  getPeriodMonths(
    value: string | null | undefined,
    unit: string | null | undefined,
  ): number | null {
    if (value === null || value === undefined || value.length === 0 || !unit) {
      return null;
    }
    const amount = parseInt(value, 10);
    if (isNaN(amount) || amount < 1) {
      return null;
    }
    return unit === 'y' ? amount * 12 : amount;
  }

  isInactivityPeriodOutOfRange(): boolean {
    const months = this.getPeriodMonths(
      this.currentConfiguration.periodInactivity,
      this.currentConfiguration.periodInactivityUnit,
    );
    return months !== null && months > ExpirationSettingsComponent.MAX_PERIOD_MONTHS;
  }

  isReviewPeriodOutOfRange(): boolean {
    const months = this.getPeriodMonths(
      this.currentConfiguration.activityCap,
      this.currentConfiguration.activityCapUnit,
    );
    return months !== null && months > ExpirationSettingsComponent.MAX_PERIOD_MONTHS;
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
    } else if (value.period.startsWith('~')) {
      config.periodType = 'inactivity';

      const unit = value.period.charAt(value.period.length - 1);
      config.periodInactivity = value.period.substring(1, value.period.length - 1);
      config.periodInactivityUnit = unit as 'm' | 'y';
    } else {
      config.periodType = 'static';

      config.periodStatic = value.period;
    }
    return config;
  }

  private setActivityCapValues(
    value: ExpirationAttrValue,
    config: ExpirationConfiguration,
  ): ExpirationConfiguration {
    const capValue = value.activityCap;
    config.activityCap = capValue.substring(0, capValue.length - 1);
    config.activityCapUnit = capValue.charAt(capValue.length - 1) as 'm' | 'y';
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

  private parseInactivityPeriod(config: ExpirationConfiguration): string {
    return '~' + config.periodInactivity + config.periodInactivityUnit;
  }

  private parseActivityCap(config: ExpirationConfiguration): string {
    const value = config.activityCap;
    if (value === null || value === undefined || value.length === 0 || !config.activityCapUnit) {
      return null;
    }
    return value + config.activityCapUnit;
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
    if (
      !config.specialLoaPeriodEnabled ||
      config.specialLoa === null ||
      config.specialLoa === undefined
    ) {
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
    const activityCap = this.parseActivityCap(config);

    const specialLoaPeriod = this.parseSpecialLoaPeriod(config);

    if (period !== null) {
      value.period = period;
    }

    if (activityCap !== null) {
      value.activityCap = activityCap;
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

  private validateExpirationRules(): boolean {
    const cfg = this.currentConfiguration;

    if (cfg.periodEnabled) {
      const hasStaticPeriod = cfg.periodType === 'static' && !!cfg.periodStatic;

      const hasDynamicPeriod =
        cfg.periodType === 'dynamic' && !!cfg.periodDynamic && !!cfg.periodDynamicUnit;

      const inactivityPeriodMonths = this.getPeriodMonths(
        cfg.periodInactivity,
        cfg.periodInactivityUnit,
      );

      const hasInactivityPeriod =
        cfg.periodType === 'inactivity' &&
        inactivityPeriodMonths !== null &&
        inactivityPeriodMonths <= ExpirationSettingsComponent.MAX_PERIOD_MONTHS;

      if (!hasStaticPeriod && !hasDynamicPeriod && !hasInactivityPeriod) {
        return false;
      }

      // the mandatory review period is optional, but when filled in it has to be valid
      const hasReviewPeriodValue =
        cfg.activityCap !== null && cfg.activityCap !== undefined && cfg.activityCap.length > 0;

      if (hasReviewPeriodValue) {
        const reviewPeriodMonths = this.getPeriodMonths(cfg.activityCap, cfg.activityCapUnit);

        if (
          reviewPeriodMonths === null ||
          reviewPeriodMonths > ExpirationSettingsComponent.MAX_PERIOD_MONTHS
        ) {
          return false;
        }
      }

      if (!cfg.gracePeriod || !cfg.gracePeriodUnit) {
        return false;
      }
    }

    if (cfg.removeAfterEnabled) {
      if (!cfg.removeAfter || !cfg.removeAfterUnit) {
        return false;
      }
    }

    if (cfg.archiveAfterEnabled) {
      if (!cfg.archiveAfter || !cfg.archiveAfterUnit) {
        return false;
      }
    }

    if (cfg.specialLoaPeriodEnabled) {
      if (cfg.specialLoa === null || cfg.specialLoa === undefined || !cfg.specialLoaPeriodType) {
        return false;
      }

      if (cfg.specialLoaPeriodType === 'static' && !cfg.specialLoaPeriodStatic) {
        return false;
      }

      if (
        cfg.specialLoaPeriodType === 'dynamic' &&
        (!cfg.specialLoaPeriodDynamic || !cfg.specialLoaPeriodDynamicUnit)
      ) {
        return false;
      }
    }

    if (cfg.doNotAllowLoasEnabled && cfg.doNotAllowLoas.length === 0) {
      return false;
    }

    if (cfg.doNotExtendLoasEnabled && cfg.doNotExtendLoas.length === 0) {
      return false;
    }

    return true;
  }
}
