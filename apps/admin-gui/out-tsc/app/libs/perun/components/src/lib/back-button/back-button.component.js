import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Location } from '@angular/common';
let BackButtonComponent = class BackButtonComponent {
    constructor(location) {
        this.location = location;
    }
    goBack() {
        this.location.back();
    }
};
BackButtonComponent = __decorate([
    Component({
        selector: 'perun-web-apps-back-button',
        templateUrl: './back-button.component.html',
        styleUrls: ['./back-button.component.scss']
    }),
    __metadata("design:paramtypes", [Location])
], BackButtonComponent);
export { BackButtonComponent };
//# sourceMappingURL=back-button.component.js.map