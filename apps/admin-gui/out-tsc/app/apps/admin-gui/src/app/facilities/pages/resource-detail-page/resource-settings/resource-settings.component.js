import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { fadeIn } from '@perun-web-apps/perun/animations';
let ResourceSettingsComponent = class ResourceSettingsComponent {
    constructor() {
    }
    ngOnInit() {
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], ResourceSettingsComponent.prototype, "true", void 0);
ResourceSettingsComponent = __decorate([
    Component({
        selector: 'app-resource-settings',
        templateUrl: './resource-settings.component.html',
        styleUrls: ['./resource-settings.component.scss'],
        animations: [
            fadeIn
        ]
    }),
    __metadata("design:paramtypes", [])
], ResourceSettingsComponent);
export { ResourceSettingsComponent };
//# sourceMappingURL=resource-settings.component.js.map