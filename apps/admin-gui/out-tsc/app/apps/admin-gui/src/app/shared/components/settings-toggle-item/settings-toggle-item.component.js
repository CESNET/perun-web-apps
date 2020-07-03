import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { openClose } from '@perun-web-apps/perun/animations';
import { MatSlideToggle } from '@angular/material/slide-toggle';
let SettingsToggleItemComponent = class SettingsToggleItemComponent {
    constructor() {
        this.modelChange = new EventEmitter();
    }
    get model() {
        return this.modelValue;
    }
    set model(value) {
        this.modelValue = value;
    }
    ngAfterViewInit() {
        this.toggle.change.subscribe(() => this.valueChanged());
    }
    valueChanged() {
        this.modelChange.emit(this.toggle.checked);
    }
};
__decorate([
    ViewChild(MatSlideToggle, { static: true }),
    __metadata("design:type", MatSlideToggle)
], SettingsToggleItemComponent.prototype, "toggle", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], SettingsToggleItemComponent.prototype, "title", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], SettingsToggleItemComponent.prototype, "modelChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], SettingsToggleItemComponent.prototype, "model", null);
SettingsToggleItemComponent = __decorate([
    Component({
        selector: 'app-settings-toggle-item',
        templateUrl: './settings-toggle-item.component.html',
        styleUrls: ['./settings-toggle-item.component.scss'],
        animations: [
            openClose
        ]
    }),
    __metadata("design:paramtypes", [])
], SettingsToggleItemComponent);
export { SettingsToggleItemComponent };
//# sourceMappingURL=settings-toggle-item.component.js.map