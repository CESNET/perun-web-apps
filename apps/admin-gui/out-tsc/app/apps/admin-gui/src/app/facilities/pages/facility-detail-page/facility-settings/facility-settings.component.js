import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { fadeIn } from '@perun-web-apps/perun/animations';
let FacilitySettingsComponent = class FacilitySettingsComponent {
    constructor() { }
    ngOnInit() {
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], FacilitySettingsComponent.prototype, "true", void 0);
FacilitySettingsComponent = __decorate([
    Component({
        selector: 'app-facility-settings',
        templateUrl: './facility-settings.component.html',
        styleUrls: ['./facility-settings.component.scss'],
        animations: [
            fadeIn
        ]
    }),
    __metadata("design:paramtypes", [])
], FacilitySettingsComponent);
export { FacilitySettingsComponent };
//# sourceMappingURL=facility-settings.component.js.map