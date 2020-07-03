import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { fadeIn } from '@perun-web-apps/perun/animations';
let MemberSettingsComponent = class MemberSettingsComponent {
    constructor() {
    }
    ngOnInit() {
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], MemberSettingsComponent.prototype, "true", void 0);
MemberSettingsComponent = __decorate([
    Component({
        selector: 'app-member-settings',
        templateUrl: './member-settings.component.html',
        styleUrls: ['./member-settings.component.scss'],
        animations: [
            fadeIn
        ]
    }),
    __metadata("design:paramtypes", [])
], MemberSettingsComponent);
export { MemberSettingsComponent };
//# sourceMappingURL=member-settings.component.js.map