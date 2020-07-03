import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
let ApplicationFormPreviewComponent = class ApplicationFormPreviewComponent {
    constructor(route) {
        this.route = route;
        this.loading = true;
        this.applicationFormItems = [];
        this.language = 'en';
        this.initialPage = true;
        this.mapForCombobox = new Map();
    }
    ngOnInit() {
        this.route.queryParamMap.subscribe(params => {
            this.applicationFormItems = JSON.parse(params.get('applicationFormItems'));
            this.loading = false;
        });
    }
    switchToInitial() {
        this.initialPage = true;
    }
    switchToExtension() {
        this.initialPage = false;
    }
    switchToEnglish() {
        this.language = 'en';
    }
    switchToCzech() {
        this.language = 'cs';
    }
    getLocalizedOptions(applicationFormItem) {
        if (applicationFormItem.i18n[this.language]) {
            const options = applicationFormItem.i18n[this.language].options;
            if (options !== null && options !== '') {
                const labels = [];
                for (const item of options.split('|')) {
                    labels.push(item.split('#')[1]);
                }
                return labels;
            }
        }
        return [];
    }
    isValid(applicationFormItem) {
        if (applicationFormItem.forDelete) {
            return false;
        }
        for (const type of applicationFormItem.applicationTypes) {
            if (type === 'INITIAL' && this.initialPage) {
                return true;
            }
            if (type === 'EXTENSION' && !this.initialPage) {
                return true;
            }
        }
        return false;
    }
    getLocalizedLabel(applicationFormItem) {
        if (applicationFormItem.i18n[this.language]) {
            return applicationFormItem.i18n[this.language].label;
        }
        return applicationFormItem.shortname;
    }
    getLocalizedHint(applicationFormItem) {
        if (applicationFormItem.i18n[this.language]) {
            return applicationFormItem.i18n[this.language].help;
        }
        return '';
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], ApplicationFormPreviewComponent.prototype, "true", void 0);
ApplicationFormPreviewComponent = __decorate([
    Component({
        selector: 'app-application-form-preview',
        templateUrl: './application-form-preview.component.html',
        styleUrls: ['./application-form-preview.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute])
], ApplicationFormPreviewComponent);
export { ApplicationFormPreviewComponent };
//# sourceMappingURL=application-form-preview.component.js.map