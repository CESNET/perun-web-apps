import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { fadeIn } from '@perun-web-apps/perun/animations';
let GroupSettingsComponent = class GroupSettingsComponent {
    constructor() {
    }
    ngOnInit() {
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], GroupSettingsComponent.prototype, "true", void 0);
GroupSettingsComponent = __decorate([
    Component({
        selector: 'app-group-settings',
        templateUrl: './group-settings.component.html',
        styleUrls: ['./group-settings.component.scss'],
        animations: [
            fadeIn
        ]
    }),
    __metadata("design:paramtypes", [])
], GroupSettingsComponent);
export { GroupSettingsComponent };
//# sourceMappingURL=group-settings.component.js.map