import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { openClose } from '@perun-web-apps/perun/animations';
export class ExpirationAttrValue {
}
let ExpirationSettingsComponent = class ExpirationSettingsComponent {
    constructor() {
        this.saveAttribute = new EventEmitter();
        this.LOAS = [0, 1, 2];
        this.datePattern = '^(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.$';
        this.dynamicAmountPattern = '^[1-9]+$';
        // TODO translation
        this.amountOptions = [{
                value: 'd',
                text: 'Days'
            }, {
                value: 'm',
                text: 'Months'
            }, {
                value: 'y',
                text: 'Years'
            }];
    }
    ngOnInit() {
        const loaPeriods = new Map();
        this.LOAS.forEach(loa => loaPeriods.set(loa, ''));
        this.initialConfiguration = this.unParseAttrValue(this.expirationAttribute.value);
        this.currentConfiguration = this.unParseAttrValue(this.expirationAttribute.value);
    }
    saveChanges() {
        this.saveAttribute.emit(this.parseExpirationRulesAttribute());
    }
    areChangesMade() {
        const currentValue = this.parseAttributeValueFromConfig(this.currentConfiguration);
        const initValue = this.parseAttributeValueFromConfig(this.initialConfiguration);
        if (initValue === null) {
            return currentValue !== null;
        }
        if (currentValue === null) {
            return true;
        }
        return currentValue.period !== initValue.period ||
            currentValue.gracePeriod !== initValue.gracePeriod ||
            currentValue.doNotExtendLoa !== initValue.doNotExtendLoa ||
            currentValue.doNotAllowLoa !== initValue.doNotAllowLoa ||
            currentValue.periodLoa !== initValue.periodLoa;
    }
    parseExpirationRulesAttribute() {
        this.expirationAttribute.value = this.parseAttributeValueFromConfig(this.currentConfiguration);
        return this.expirationAttribute;
    }
    parsePeriod(config) {
        switch (config.periodType) {
            case 'dynamic':
                return this.parseDynamicPeriod(config);
            case 'static':
                return this.parseStaticPeriod(config);
            default:
            // TODO show error
        }
    }
    createInitConfiguration() {
        const loaPeriods = new Map();
        this.LOAS.forEach(loa => loaPeriods.set(loa, ''));
        return {
            enabled: false,
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
            specialLoaPeriodEnabled: false,
            specialLoaPeriod: '',
            specialLoa: null,
            specialLoaPeriodType: null,
            specialLoaPeriodDynamic: '',
            specialLoaPeriodDynamicUnit: 'm',
            specialLoaPeriodStatic: '',
            specialLoaPeriodExtendExpiredMembers: false
        };
    }
    unParseAttrValue(value) {
        let config = this.createInitConfiguration();
        if (value == null) {
            return config;
        }
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
            config = this.setGracePeriodValues(value, config);
        }
        if (value.periodLoa !== undefined && value.periodLoa.length > 0) {
            config = this.setSpecialLoaPeriodValues(value, config);
        }
        return config;
    }
    setPeriodValues(value, config) {
        config.enabled = true;
        if (value.period.startsWith('+')) {
            config.periodType = 'dynamic';
            const unit = value.period.charAt(value.period.length - 1);
            config.periodDynamic = value.period.substring(1, value.period.length - 1);
            config.periodDynamicUnit = unit;
        }
        else {
            config.periodType = 'static';
            config.periodStatic = value.period;
        }
        return config;
    }
    setDoNotAllowLoasValues(value, config) {
        const loas = [];
        value.doNotAllowLoa.split(',').forEach(l => loas.push(parseInt(l.trim(), 10)));
        config.doNotAllowLoas = loas;
        if (loas.length > 0) {
            config.doNotAllowLoasEnabled = true;
        }
        return config;
    }
    setDoNotExtendLoasValues(value, config) {
        const loas = [];
        value.doNotExtendLoa.split(',').forEach(l => loas.push(parseInt(l.trim(), 10)));
        config.doNotExtendLoas = loas;
        if (loas.length > 0) {
            config.doNotExtendLoasEnabled = true;
        }
        return config;
    }
    setGracePeriodValues(value, config) {
        config.gracePeriodEnabled = true;
        const unit = value.gracePeriod.charAt(value.gracePeriod.length - 1);
        config.gracePeriod = value.gracePeriod.substring(0, value.gracePeriod.length - 1);
        config.gracePeriodUnit = unit;
        return config;
    }
    setSpecialLoaPeriodValues(value, config) {
        config.specialLoa = parseInt(value.periodLoa.substring(0, value.periodLoa.indexOf('|')), 10);
        config.specialLoaPeriodEnabled = true;
        let specialPeriodValue = value.periodLoa.substring(value.periodLoa.indexOf('|') + 1, value.periodLoa.length);
        if (specialPeriodValue.startsWith('+')) {
            if (specialPeriodValue.endsWith('.')) {
                config.specialLoaPeriodExtendExpiredMembers = true;
                specialPeriodValue = specialPeriodValue.substring(0, specialPeriodValue.length - 1);
            }
            config.specialLoaPeriodType = 'dynamic';
            const unit = specialPeriodValue.charAt(specialPeriodValue.length - 1);
            config.specialLoaPeriodDynamic = specialPeriodValue.substring(1, specialPeriodValue.length - 1);
            config.specialLoaPeriodDynamicUnit = unit;
        }
        else {
            if (specialPeriodValue.endsWith('..')) {
                config.specialLoaPeriodExtendExpiredMembers = true;
                specialPeriodValue = specialPeriodValue.substring(0, specialPeriodValue.length - 1);
            }
            config.specialLoaPeriodType = 'static';
            config.specialLoaPeriodStatic = specialPeriodValue;
        }
        return config;
    }
    parseDynamicPeriod(config) {
        return '+' + config.periodDynamic + config.periodDynamicUnit;
    }
    parseStaticPeriod(config) {
        return config.periodStatic;
    }
    parseDontAllowLoas(config) {
        if (!config.doNotAllowLoasEnabled) {
            return null;
        }
        let dontAllowLoas = '';
        config.doNotAllowLoas.forEach(loa => dontAllowLoas += loa + ',');
        if (dontAllowLoas.length > 0) {
            dontAllowLoas = dontAllowLoas.substring(0, dontAllowLoas.length - 1);
        }
        return dontAllowLoas.length > 0 ? dontAllowLoas : null;
    }
    parseDontExtendLoas(config) {
        if (!config.doNotExtendLoasEnabled) {
            return null;
        }
        let dontExtendLoas = '';
        config.doNotExtendLoas.forEach(loa => dontExtendLoas += loa + ',');
        if (dontExtendLoas.length > 0) {
            dontExtendLoas = dontExtendLoas.substring(0, dontExtendLoas.length - 1);
        }
        return dontExtendLoas.length > 0 ? dontExtendLoas : null;
    }
    parseGracePeriod(config) {
        if (!config.gracePeriodEnabled) {
            return null;
        }
        return config.gracePeriod + config.gracePeriodUnit;
    }
    parseSpecialLoaPeriod(config) {
        if (!config.specialLoaPeriodEnabled) {
            return null;
        }
        let period = config.specialLoa + '|';
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
    parseSpecialLoaPeriodStatic(config) {
        return config.specialLoaPeriodStatic;
    }
    parseSpecialLoaPeriodDynamic(config) {
        return '+' + config.specialLoaPeriodDynamic + config.specialLoaPeriodDynamicUnit;
    }
    parseAttributeValueFromConfig(config) {
        if (!config.enabled) {
            return null;
        }
        const period = this.parsePeriod(config);
        const dontAllowLoas = this.parseDontAllowLoas(config);
        const dontExtendLoad = this.parseDontExtendLoas(config);
        const gracePeriod = this.parseGracePeriod(config);
        const specialLoaPeriod = this.parseSpecialLoaPeriod(config);
        const value = {
            period: period,
        };
        if (dontExtendLoad !== null) {
            value.doNotExtendLoa = dontExtendLoad;
        }
        if (dontAllowLoas !== null) {
            value.doNotAllowLoa = dontAllowLoas;
        }
        if (gracePeriod !== null) {
            value.gracePeriod = gracePeriod;
        }
        if (specialLoaPeriod !== null) {
            value.periodLoa = specialLoaPeriod;
        }
        return value;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], ExpirationSettingsComponent.prototype, "expirationAttribute", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], ExpirationSettingsComponent.prototype, "saveAttribute", void 0);
ExpirationSettingsComponent = __decorate([
    Component({
        selector: 'app-expiration-settings',
        templateUrl: './expiration-settings.component.html',
        styleUrls: ['./expiration-settings.component.scss'],
        animations: [
            openClose
        ]
    }),
    __metadata("design:paramtypes", [])
], ExpirationSettingsComponent);
export { ExpirationSettingsComponent };
//# sourceMappingURL=expiration-settings.component.js.map